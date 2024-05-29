require('dotenv').config();
const express = require('express');
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const axios = require('axios');
const OAuth2Strategy = require('passport-oauth2').Strategy;
const path = require('path');
const passport = require('./passport-config');
const { isAuthenticated } = require('./middleware');
const db = require('./db');
const app = express();

const port = process.env.PORT || 3000;

app.use(express.static('assets'));
app.use('/src', express.static(path.join(__dirname, 'public', 'src')));
app.use('/awosview/images', express.static(path.join(__dirname, 'public', 'awosview', 'images')));

// VATSIM AUTHENTICATION
app.use(session({
  store: new pgSession({
    pool: db.pool,
    tableName: 'session'
  }),
  secret: process.env.SESSION_SECRET, 
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true
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

app.get('/user-data', (req, res) => {
  if (req.user) {
    const { id, full_name, rating } = req.user;
    res.json({ id, full_name, rating });
  } else {
    res.status(401).json({ message: 'User not authenticated' });
  }
});

app.use(isAuthenticated, express.static(path.join(__dirname, 'public')));

app.get('/logout', (req, res, next) => {
  req.logout(err => {
    if (err) { return next(err); }
    res.redirect('/login?message=logged_out');
  });
});

// END OF AUTHENTICATION

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

app.listen(port, function () {
    console.log('App is listening on port ' + port + '!');
});
