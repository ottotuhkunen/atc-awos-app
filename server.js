require('dotenv').config()
const express = require('express');
const basicAuth = require('express-basic-auth')
const app = express();
const axios = require('axios');
const { JSDOM } = require('jsdom');
const { takeScreenshot } = require('./screenshot');

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

// Public directory for images
const publicDir = path.join(__dirname, 'public');
app.use('/ausx5LTvjwDa', express.static(publicDir));

app.listen(port, () => {
  console.log(`Server running on port ${port}`);

  // Take screenshot every 3 minutes
  setInterval(async () => {
    const screenshot = await takeScreenshot();

    // Use a constant file name
    const fileName = 'ulos.png';
    const filePath = path.join(publicDir, fileName);

    fs.writeFileSync(filePath, screenshot);

    console.log(`Saved screenshot as ${fileName}`);
  }, 3 * 60 * 1000);
});

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
