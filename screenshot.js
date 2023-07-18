const puppeteer = require('puppeteer');

// Define sleep function
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function takeScreenshot() {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();

  // Adjust the viewport size if needed
  await page.setViewport({ width: 1280, height: 800 });

  // Navigate to your website
  await page.goto('https://wx.lusep.fi');

  // Wait for any dynamic content to load
  await sleep(5000); // Adjust the timeout value if needed

  // Take a screenshot of the page
  const screenshot = await page.screenshot({ type: 'png' });

  await browser.close();

  return screenshot;
}

module.exports = { takeScreenshot };
