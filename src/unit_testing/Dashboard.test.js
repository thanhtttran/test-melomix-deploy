// Dashboard.test.js
const { expect, assert } = require('chai');

// puppeteer-extra is a drop-in replacement for puppeteer,
// it augments the installed puppeteer with plugin functionality
const puppeteer = require('puppeteer-extra')

// add stealth plugin and use defaults (all evasion techniques)
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin())


describe('Dashboard Test', () => {
  let browser;
  let page;

  before(async () => {
    // Launch a new browser instance before running the tests
    browser = await puppeteer.launch({ headless: false, ignoreDefaultArgs: ['--enable-automation'] });
    // Create a new page for each test
    page = await browser.newPage();
  });

  after(async () => {
    // Close the browser after all tests are completed
    await browser.close();
  });

  it('Log in user (no verifications)', async () => {
    // Navigate to the dashboard page
    await page.goto('https://test-melomix-deploy.vercel.app/');
   
    // Wait for a short duration to ensure the page loads
    await page.waitForTimeout(1000);

    // Verify that the search bar is present on the dashboard
    const loginNav = await page.waitForSelector('.nav-link[href="/login"]'); 
    assert.isNotNull(loginNav);

    await loginNav.click();
    await page.waitForTimeout(3000);
    
    await page.type('input[type="text"]', "JiminChar2");
    await page.waitForTimeout(1000);
   
    await page.type('input[type="password"]', "JiminChar2!");
    await page.waitForTimeout(2000);
    const pathSelector = "#root > div > div.tw-w-full.tw-min-h-screen.tw-flex.tw-justify-center.tw-items-center.tw-bg-gray-900 > div > div.tw-absolute.tw-inset-1.tw-bg-gray-950.tw-rounded-lg.tw-z-10.tw-p-5 > form > div.tw-flex.tw-justify-center.tw-mt-16.tw-text-xs > svg > path"
    const pathElement = await page.waitForSelector(pathSelector);
    await Promise.all([
      await pathElement.click()
    ]);

  });

  it('should load the dashboard and display a search bar', async () => {
    // Navigate to the dashboard page
    await page.waitForTimeout(1000);
    const dashboardNav = await page.waitForSelector('.tw-text-3xl');
    assert.isNotNull(dashboardNav);

    await dashboardNav.click();
    await page.waitForTimeout(1000);
   

    // Verify that the search bar is present on the dashboard
    const searchElement = await page.waitForSelector('form > .form-control'); 
    assert.isNotNull(searchElement);
  });

  it('should display "No tracks found" if search yields no results', async () => {
    // Locate the search button on the dashboard
    const searchBtn = await page.waitForSelector('form > button');

    // Type a search term that won't yield any results
    await page.type('input[type="text"]', 'asdasdasfgfasfasfgdfasfdasdasf');

    // Wait for a short duration to simulate user interaction
    await page.waitForTimeout(1000);

    // Click the search button
    await searchBtn.click();

    // Dispose of the search button to prevent memory leaks
    await searchBtn.dispose();

    // Check if the "No tracks found" message is displayed
    const trackTextElement = await page.waitForSelector('.albums-container > .text-secondary');
    const trackText = await page.evaluate(trackTextElement => trackTextElement.textContent, trackTextElement);
    assert.equal(trackText, "No tracks found");
  });

  it('when searching for valid input, a list of items should populate the screen', async () => {
    // Locate the search button on the dashboard
    const searchBtn = await page.waitForSelector('form > button');

    // Remove any previous text in the search input field
    await page.focus('.form-control');
    await page.keyboard.down('Control');
    await page.keyboard.press('A');
    await page.keyboard.up('Control');
    await page.keyboard.press('Backspace');

    // Type a valid search term
    await page.type('input[type="text"]', 'peee');

    // Wait for a short duration to simulate user interaction
    await page.waitForTimeout(1000);

    // Click the search button
    await searchBtn.click();

    // Wait for a longer duration for the items to populate
    await page.waitForTimeout(2000);

    // Check if the album container is present, indicating successful item population
    const albumContainer = await page.waitForSelector('.albums-container > .album-container');
    assert.isNotNull(albumContainer);
  });

  it("when selecting a valid input's play button, a Spotify player and lyrics button should appear", async () => {
    // Locate the play button for an item on the dashboard
    const itemButton = await page.waitForSelector('.album-container > button');

    // Click the play button for a valid item
    await itemButton.click();

    // Wait for a duration to allow for the appearance of elements after clicking play
    await page.waitForTimeout(3000);

    // Check if the Spotify player and lyrics button are present
    const spotifyBtn = await page.waitForSelector('[class*="ButtonRSWP"]');
    const lyricsBtn = await page.waitForSelector('[class*="lyrics-button"]');
    assert.isNotNull(spotifyBtn);
    assert.isNotNull(lyricsBtn);
  });
});
