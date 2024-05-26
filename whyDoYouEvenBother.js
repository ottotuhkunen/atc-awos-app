require('dotenv').config()
const express = require('express');
const basicAuth = require('express-basic-auth')
const app = express();
const axios = require('axios');
// const fetch = require('node-fetch');
const passport = require('passport');
const OAuth2Strategy = require('passport-oauth2').Strategy;
const session = require('express-session');
const path = require('path');
const db = require('./db');

app.get('/api/data', async (req, res) => {
  const baseUrl = "https://api.airtable.com/v0/appGAYI2wFvY7jZVG/Table%201";
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
      console.log(error);
      res.status(500).json({ message: "Error fetching data" });
  }
});

const port = process.env.PORT || 3000;

// fetch data from airtable:
app.get('/dataEFHK', async (req, res) => {
  const baseUrl = "https://api.airtable.com/v0/appGAYI2wFvY7jZVG/Table%201";
  
  const requestOptions = {
      method: 'GET',
      headers: {
          'Authorization': 'Bearer patdi7Qmwc4DabdNb.2bd05fae548b7ec31be6a80e2500e78c499b0cf2b5a1b5c893211538d962eb0d'
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

/*

// Basic Auth Configuration
app.use(basicAuth({
    users: { 
        [process.env.BASIC_AUTH_USER]: process.env.BASIC_AUTH_PASSWORD 
    },
    challenge: true
}));

// Enforce HTTPS
app.use((req, res, next) => {
    if (req.header('x-forwarded-proto') !== 'https' && process.env.NODE_ENV === 'production') {
        res.redirect(`https://${req.header('host')}${req.url}`);
    } else {
        next();
    }
});

*/

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
    const response = await axios.get('https://auth.vatsim.net/api/user', { // https://auth-dev.vatsim.net/api/user (DEV)
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
        'INSERT INTO users (id, full_name, rating) VALUES ($1, $2, $3)',
        [user.id, user.full_name, user.rating]
      );
    } else {
      // If the user exists, update their information
      await db.query(
        'UPDATE users SET full_name = $1, rating = $2 WHERE id = $3',
        [user.full_name, user.rating, user.id]
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
  secret: 'secret',
  resave: false,
  saveUninitialized: true,
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

app.use(express.static('assets'));

// This is used to show authenticated user's data on frontend:
app.get('/user-data', isAuthenticated, (req, res) => {
    res.json(req.user); // Send the authenticated user's data as JSON
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

app.listen(port, function () {
    console.log('App is listening on port ' + port + '!');
});
