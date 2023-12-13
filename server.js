require('dotenv').config()
const express = require('express');
const basicAuth = require('express-basic-auth')
const app = express();
const axios = require('axios');
// const fetch = require('node-fetch');

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


app.use(express.static('.'));

app.listen(port, function () {
    console.log('App is listening on port ' + port + '!');
});