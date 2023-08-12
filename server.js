require('dotenv').config()
const express = require('express');
const basicAuth = require('express-basic-auth')
const app = express();
const axios = require('axios');
const cheerio = require('cheerio');
const { JSDOM } = require('jsdom');

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

app.get('/snowtam', async (req, res) => {
  try {
      const { data } = await axios.get('https://www.ais.fi/ais/bulletins/efinen.htm');
      
      // Remove all HTML tags
      let contentWithoutHtml = data.replace(/<\/?[^>]+(>|$)/g, " ");
      
      // Remove all newline characters
      contentWithoutHtml = contentWithoutHtml.replace(/\n/g, "<br>");
      
      // Replace 2 or more white spaces with a single white space
      contentWithoutHtml = contentWithoutHtml.replace(/\s{2,}/g, " ").trim();

      // SNOWTAM<br> EFIV08091419 04 6/6/6 NR/NR/NR NR/NR/NR DRY/DRY/DRYREMARK/ RWY 04 NEXT PLANNED ASSESSMENT 08091730 UTC ESTIMATEDCONDITION DRY.
      let rawSnowtam = "";

      // Extract the desired string
      const matches = contentWithoutHtml.match(/SNOWTAM<br> EFHK.*?\+/);
    
      if (matches) {
          rawSnowtam = matches[0];
          rawSnowtam = rawSnowtam.replace(" +", "");
      }

      
      console.log(rawSnowtam);
      res.json({ data: rawSnowtam });
  } catch (error) {
      res.status(500).json({ error: 'Failed to scrape data' });
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
app.use((req, res, next) => {
    if (req.header('x-forwarded-proto') !== 'https') {
      res.redirect(`https://${req.header('host')}${req.url}`);
    } else {
      next();
    }
});

app.use(basicAuth({
    users: { [process.env.BASIC_AUTH_USER]: process.env.BASIC_AUTH_PASSWORD },
    challenge: true
}));
*/

app.use(express.static('.')); // index.html directory

app.listen(port, function () {
    console.log('App is listening on port ' + port + '!');
});
