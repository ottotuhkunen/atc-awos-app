require('dotenv').config();
const express = require('express');
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const axios = require('axios');
const passport = require('passport');
const OAuth2Strategy = require('passport-oauth2').Strategy;
const path = require('path');
const db = require('./db');
const app = express();

app.set('trust proxy', 1); // Trust the first proxy (Heroku)
const port = process.env.PORT || 3000;

app.use(express.static('assets'));
app.use('/src', express.static(path.join(__dirname, 'public', 'src')));
app.use('/awosview/images', express.static(path.join(__dirname, 'public', 'awosview', 'images')));

// VATSIM AUTHENTICATION

passport.use(new OAuth2Strategy({
  authorizationURL: process.env.AUTH_URL_HEROKU || process.env.AUTH_URL,
  tokenURL: process.env.TOKEN_URL_HEROKU || process.env.TOKEN_URL,
  clientID: process.env.CLIENT_ID_HEROKU || process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET_HEROKU || process.env.CLIENT_SECRET,
  callbackURL: process.env.REDIRECT_URL_HEROKU || process.env.REDIRECT_URI,
},
async function(accessToken, refreshToken, profile, cb) {
  try {
    const response = await axios.get(process.env.RESPONSE_URL_HEROKU || process.env.RESPONSE_URL, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    const userData = response.data.data;

    const user = {
      id: userData.cid.toString(),
      full_name: userData.personal.name_full,
      rating: userData.vatsim.rating.short
    };

    // Check if the rating is not "OBS" or "SUS"
    if (user.rating === 'OBS' || user.rating === 'SUS') {
      return cb(null, false, { message: 'Unauthorized rating' });
    }

    // Check if the user already exists in the database
    let dbUser = await db.query('SELECT * FROM users WHERE id = $1', [user.id]);
    
    if (dbUser.rows.length === 0) {
      // If the user doesn't exist, insert them
      await db.query(
        'INSERT INTO users (id, full_name, rating, last_login, app) VALUES ($1, $2, $3, CURRENT_TIMESTAMP, $4)',
        [user.id, user.full_name, user.rating, 'wx']
      );
    } else {
      // If the user exists, update their information including last login time
      await db.query(
        'UPDATE users SET full_name = $1, rating = $2, last_login = CURRENT_TIMESTAMP, app = $3 WHERE id = $4',
        [user.full_name, user.rating, 'wx', user.id]
      );
    }

    return cb(null, user);
  } catch (error) {
    return cb(error);
  }
}));

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const dbUser = await db.query('SELECT * FROM users WHERE id = $1', [id]);
    done(null, dbUser.rows[0]);
  } catch (error) {
    done(error);
  }
});

// Express middleware
app.use(session({
  store: new pgSession({
    pool: db.pool,
    tableName: 'session'
  }),
  secret: process.env.SESSION_SECRET || 'default_secret',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: process.env.NODE_ENV === 'production',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  }
}));

app.use(passport.initialize());
app.use(passport.session());

// Route to serve login page
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'login.html'));
});

// Route for OAuth2 authentication
app.get('/auth/vatsim', passport.authenticate('oauth2', {
  scope: ['full_name', 'vatsim_details']
}));

// OAuth2 callback route
app.get('/callback',
  passport.authenticate('oauth2', { failureRedirect: '/login?error=access_denied' }),
  function(req, res) {
    res.redirect('/index.html');
  }
);

// This is used to show authenticated user's data on frontend:
app.get('/user-data', isAuthenticated, (req, res) => {
  if (req.user) {
      const { id, full_name, rating } = req.user;
      res.json({ id, full_name, rating }); // Send only the required user's data as JSON
  } else {
      res.status(401).json({ message: 'User not authenticated' });
  }
});

// Middleware to check if the user is authenticated
function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect('/login');
  }
}

// Serve static files (only accessible if authenticated)
app.use(isAuthenticated, express.static(path.join(__dirname, 'public')));

// Route to handle logout
app.get('/logout', (req, res, next) => {
  req.logout(err => {
    if (err) { return next(err); }
    res.redirect('/login?message=logged_out');
  });
});

// END OF AUTHENTICATION

// fetch weather from FMI Helsinki-Vantaa airport
app.get('/api/weather', async (req, res) => {
  const fmisid = 100968;
  const { startTime, endTime } = getTimes();

  const url = `https://opendata.fmi.fi/wfs?service=WFS&version=2.0.0&request=getFeature&storedquery_id=fmi::observations::weather::simple&fmisid=${fmisid}&starttime=${startTime}&endtime=${endTime}&timestep=2`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const responseText = await response.text();
    res.set('Content-Type', 'application/xml');
    res.send(responseText);
  } catch (error) {
    console.error('Fetch API error -', error);
    res.status(500).json({ error: 'Failed to fetch weather data' });
  }
});

// fetch data from airtable:
app.get('/dataEFHK', async (req, res) => {
  const baseUrl = process.env.AIRTABLE_URL;
  
  const requestOptions = {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.AIRTABLE_API_KEY}`
      },
  };

  try {
      const response = await fetch(baseUrl, requestOptions);
      const data = await response.json();
      res.json(data);
  } catch (error) {
      res.status(500).json({ error: "Failed to fetch data from Airtable." });
  }
});

// get tactical messages
/*
app.get('/messages', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM messages');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching data from PostgreSQL:', error);
    res.status(500).json({ error: "Failed to fetch data from PostgreSQL." });
  }
});
*/

// fetch ATIS data from VATSIM
let cachedAtisData = null;
let cacheTimestamp = null;

// Function to fetch VATSIM data
async function fetchVatsimData() {
  try {
    const response = await fetch('https://data.vatsim.net/v3/vatsim-data.json');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching VATSIM data:', error);
    return null;
  }
}

async function getAtisData() {
  const CACHE_DURATION = 120000; // 120 seconds
  const now = Date.now();

  if (cachedAtisData && cacheTimestamp && (now - cacheTimestamp < CACHE_DURATION)) {
    return cachedAtisData;
  }

  const vatsimData = await fetchVatsimData();
  if (vatsimData && vatsimData.atis) {
    cachedAtisData = vatsimData.atis.filter(item => 
      ["EFHK_ATIS", "EFHK_D_ATIS", "EFHK_A_ATIS"].includes(item.callsign)
    );
    cacheTimestamp = now;
    return cachedAtisData;
  } else {
    return null;
  }
}

app.get('/api/atis', async (req, res) => {
  try {
    const atisData = await getAtisData();
    if (atisData) {
      res.json({ atis: atisData });
    } else {
      res.status(500).json({ error: 'Unable to fetch ATIS data' });
    }
  } catch (error) {
    console.error('Error in /api/atis:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// END OF ATIS DATA

// fetch SNWOTAM:
app.get('/snowtam', async (req, res) => {
    try {
        const { data } = await axios.get('https://www.ais.fi/bulletins/efinen.htm');
        
        // Remove all HTML tags
        let contentWithoutHtml = data.replace(/<\/?[^>]+(>|$)/g, " ");
        
        // Remove all newline characters
        contentWithoutHtml = contentWithoutHtml.replace(/\n/g, "<br>");
        
        // Replace extra spaces with only one space
        contentWithoutHtml = contentWithoutHtml.replace(/\s{2,}/g, " ").trim();

        // SNOWTAM<br> EFHK...
        let rawSnowtam = "SNOWTAM NIL";

        // Extract SNOWTAM from page
        const matches = contentWithoutHtml.match(/SNOWTAM<br> EFHK.*?\+/);
    
        if (matches) {
            rawSnowtam = matches[0];
            rawSnowtam = rawSnowtam.replace(" +", "");
            rawSnowtam = rawSnowtam.replace(/EFIV.*$/, "");
        }

        res.json({ data: rawSnowtam });
    } catch (error) {
        res.status(500).json({ error: 'Failed to get SNOWTAM' });
    }
});

// fetch TAFs:
app.get('/api/taf/:location', async (req, res) => {
    const location = req.params.location;
    
    const apiURL = `https://api.checkwx.com/taf/${location}`;
    
    const response = await fetch(apiURL, {
        method: 'GET',
        headers: {
            "X-API-Key": "bcad5819aedc44a7aa9b4705be"
        }
    });

    const data = await response.json();
    res.json(data);
});

// fetch decoded METAR for EFHK:
app.get('/api/decocedmetar/:location', async (req, res) => {
    const location = req.params.location;
    
    const apiURL = `https://api.checkwx.com/metar/${location}/decoded`;
    
    const response = await fetch(apiURL, {
        method: 'GET',
        headers: {
            "X-API-Key": "bcad5819aedc44a7aa9b4705be"
        }
    });

    const data = await response.json();
    res.json(data);
});

// fetch METARs:
app.get('/api/metar/:location', async (req, res) => {
  const location = req.params.location;
  
  const apiURL = `https://api.checkwx.com/metar/${location}`;
  
  const response = await fetch(apiURL, {
      method: 'GET',
      headers: {
          "X-API-Key": "bcad5819aedc44a7aa9b4705be"
      }
  });

  const data = await response.json();
  res.json(data);
});

// get the current time in ISO format (for data fetching)
function getTimes() {
  const now = new Date();
  const startTime = new Date(now);
  startTime.setMinutes(now.getMinutes() - 15); // startTime 15 mins ago
  startTime.setSeconds(0, 0);

  // Get the current time rounded to the nearest even minute, minus 1 minute
  const roundedMinutes = now.getMinutes() - (now.getMinutes() % 2) - 1;
  now.setMinutes(roundedMinutes);
  now.setSeconds(0, 0);

  return {
    startTime: startTime.toISOString(),
    endTime: now.toISOString()
  };
}

app.listen(port, function () {
    console.log('App is listening on port ' + port + '!');
});
