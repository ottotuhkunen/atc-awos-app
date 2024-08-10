require('dotenv').config();
const express = require('express');
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const axios = require('axios');
const passport = require('passport');
const OAuth2Strategy = require('passport-oauth2').Strategy;
const { parseStringPromise, Builder } = require('xml2js');
const path = require('path');
const db = require('./db');
const app = express();

app.set('trust proxy', 1); // Trust the first proxy (Heroku)
const port = process.env.PORT || 3000;

app.use(express.static('assets'));
app.use('/src', express.static(path.join(__dirname, 'public', 'src')));
app.use('/awosview/images', express.static(path.join(__dirname, 'public', 'awosview', 'images')));

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

    if (user.rating === 'OBS' || user.rating === 'SUS') {
      return cb(null, false, { message: 'Unauthorized rating' });
    }

    let dbUser = await db.query('SELECT * FROM users WHERE id = $1', [user.id]);
    
    if (dbUser.rows.length === 0) {
      await db.query(
        'INSERT INTO users (id, full_name, rating, last_login, app) VALUES ($1, $2, $3, CURRENT_TIMESTAMP, $4)',
        [user.id, user.full_name, user.rating, 'wx']
      );
    } else {
      await db.query(
        'UPDATE users SET full_name = $1, rating = $2, last_login = CURRENT_TIMESTAMP, app = $3 WHERE id = $4',
        [user.full_name, user.rating, 'wx', user.id]
      );
    }

    return cb(null, user);
  } catch (error) {
    console.error('Error during authentication:', error);
    return cb(error);
  }
}));

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const dbUser = await db.query('SELECT * FROM users WHERE id = $1', [id]);
    done(null, dbUser.rows[0]);
  } catch (error) {
    console.error('Error during deserialization:', error);
    done(error);
  }
});

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

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'login.html'));
});

app.get('/auth/vatsim', passport.authenticate('oauth2', {
  scope: ['full_name', 'vatsim_details']
}));

app.get('/callback',
  passport.authenticate('oauth2', { failureRedirect: '/login?error=access_denied' }),
  function(req, res) {
    res.redirect('/index.html');
  }
);

app.get('/user-data', isAuthenticated, (req, res) => {
  if (req.user) {
      const { id, full_name, rating } = req.user;
      res.json({ id, full_name, rating });
  } else {
      res.status(401).json({ message: 'User not authenticated' });
  }
});

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect('/login');
  }
}

app.use(isAuthenticated, express.static(path.join(__dirname, 'public')));

app.get('/logout', (req, res, next) => {
  req.logout(err => {
    if (err) { return next(err); }
    res.redirect('/login?message=logged_out');
  });
});

async function filterNaNValues(xml) {
  const json = await parseStringPromise(xml);

  if (json['wfs:FeatureCollection'] && json['wfs:FeatureCollection']['wfs:member']) {
    json['wfs:FeatureCollection']['wfs:member'] = json['wfs:FeatureCollection']['wfs:member'].filter(member => {
      const parameterValue = member['BsWfs:BsWfsElement'][0]['BsWfs:ParameterValue'][0];
      return parameterValue !== 'NaN';
    });
  }

  const builder = new Builder();
  return builder.buildObject(json);
}

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
    const filteredResponseText = await filterNaNValues(responseText);

    res.set('Content-Type', 'application/xml');
    res.send(filteredResponseText);
  } catch (error) {
    console.error('Fetch API error -', error);
    res.status(500).json({ error: 'Failed to fetch weather data' });
  }
});

function getTimes() {
  const now = new Date();
  const startTime = new Date(now);
  startTime.setMinutes(now.getMinutes() - 15);
  startTime.setSeconds(0, 0);

  const roundedMinutes = now.getMinutes() - (now.getMinutes() % 2) - 1;
  now.setMinutes(roundedMinutes);
  now.setSeconds(0, 0);

  return {
    startTime: startTime.toISOString(),
    endTime: now.toISOString()
  };
}

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
      console.error('Error fetching data from Airtable:', error);
      res.status(500).json({ error: "Failed to fetch data from Airtable." });
  }
});

let cachedAtisData = null;
let cacheTimestamp = null;

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
  const CACHE_DURATION = 90000;
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

app.get('/snowtam', async (req, res) => {
  try {
      const { data } = await axios.get('https://www.ais.fi/bulletins/efinen.htm');
      
      let contentWithoutHtml = data.replace(/<\/?[^>]+(>|$)/g, " ");
      contentWithoutHtml = contentWithoutHtml.replace(/\n/g, "<br>");
      contentWithoutHtml = contentWithoutHtml.replace(/\s{2,}/g, " ").trim();

      let rawSnowtam = "SNOWTAM NIL";

      const matches = contentWithoutHtml.match(/SNOWTAM<br> EFHK.*?\+/);
  
      if (matches) {
          rawSnowtam = matches[0];
          rawSnowtam = rawSnowtam.replace(" +", "");
          rawSnowtam = rawSnowtam.replace(/EFIV.*$/, "");
      }

      res.json({ data: rawSnowtam });
  } catch (error) {
      console.error('Error fetching SNOWTAM:', error);
      res.status(500).json({ error: 'Failed to get SNOWTAM' });
  }
});

app.get('/api/taf/:location', async (req, res) => {
  const location = req.params.location;
  
  const apiURL = `https://api.checkwx.com/taf/${location}`;
  
  try {
    const response = await fetch(apiURL, {
        method: 'GET',
        headers: {
            "X-API-Key": "bcad5819aedc44a7aa9b4705be"
        }
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error fetching TAF:', error);
    res.status(500).json({ error: 'Failed to fetch TAF data' });
  }
});

app.get('/api/decodedmetar/:location', async (req, res) => {
  const location = req.params.location;
  
  const apiURL = `https://api.checkwx.com/metar/${location}/decoded`;
  
  try {
    const response = await fetch(apiURL, {
        method: 'GET',
        headers: {
            "X-API-Key": "bcad5819aedc44a7aa9b4705be"
        }
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error fetching decoded METAR:', error);
    res.status(500).json({ error: 'Failed to fetch decoded METAR data' });
  }
});

app.get('/api/metar/:location', async (req, res) => {
  const location = req.params.location;
  
  const apiURL = `https://api.checkwx.com/metar/${location}`;
  
  try {
    const response = await fetch(apiURL, {
        method: 'GET',
        headers: {
            "X-API-Key": "bcad5819aedc44a7aa9b4705be"
        }
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error fetching METAR:', error);
    res.status(500).json({ error: 'Failed to fetch METAR data' });
  }
});

async function fetchFmiData() {
  let fmiurl = process.env.FMIURL_HEROKU || process.env.FMIURL;

  const timestamp = Date.now();
  fmiurl += `&preventcache=${timestamp}`;
  
  try {
    const response = await axios.get(fmiurl);
    return response.data;
  } catch (error) {
    console.error('Error fetching FMI data:', error);
    throw error;
  }
}

app.get('/api/fmidata', async (req, res) => {
  try {
    const data = await fetchFmiData();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch FMI data' });
  }
});

app.listen(port, function () {
    console.log('App is listening on port ' + port + '!');
});
