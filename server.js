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

/*
app.get('/snowtam', async (req, res) => {
  try {
      const { data } = await axios.get('https://www.ais.fi/ais/bulletins/efinen.htm');
      
      // Regular expression to capture content after "ENONTEKIO AFIS CLSD" until a '<' (which usually signifies the start of an HTML tag)
      const regex = /ENONTEKIO AFIS CLSD. (.*?)</;
      const matches = data.match(regex);
      let extractedData = "NO SNOWTAM";
      if (matches && matches[1]) {
          extractedData = matches[1].trim(); // captures content after "ENONTEKIO AFIS CLSD"
      }
      res.json({ data: extractedData });
  } catch (error) {
      res.status(500).json({ error: 'Failed to scrape data' });
  }
});
*/


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

app.use(express.static('.')); // index.html directory

app.listen(port, function () {
    console.log('App is listening on port ' + port + '!');
});
