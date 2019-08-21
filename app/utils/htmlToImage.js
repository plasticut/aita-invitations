const puppeteer = require('puppeteer');

module.exports = htmlToImage;

async function htmlToImage(html, options) {
  const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
  const page = await browser.newPage();
  await page.setContent(html);
  const imageBuffer = await page.screenshot({
    encoding: 'binary',
    type: 'png',
    fullPage: false,
    clip: {
      x: 0,
      y: 0,
      width: 500,
      height: 300
    },
    ...options
  });
  await browser.close();

  return imageBuffer;
}
