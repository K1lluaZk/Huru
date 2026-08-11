const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const { EXPLICIT_WAIT_MS } = require('../config');

async function buildDriver() {
  const options = new chrome.Options();
  options.addArguments('--window-size=1366,900', '--no-sandbox', '--disable-dev-shm-usage');
  const driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();
  return driver;
}

async function waitAndFind(driver, locator, timeout = EXPLICIT_WAIT_MS) {
  await driver.wait(until.elementLocated(locator), timeout);
  const el = await driver.findElement(locator);
  await driver.wait(until.elementIsVisible(el), timeout);
  return el;
}

async function typeInto(driver, locator, text) {
  const el = await waitAndFind(driver, locator);
  await el.clear();
  await el.sendKeys(text);
  return el;
}

async function clickWhenClickable(driver, locator, timeout = EXPLICIT_WAIT_MS) {
  const el = await waitAndFind(driver, locator, timeout);
  await driver.wait(until.elementIsEnabled(el), timeout);
  await el.click();
  return el;
}

module.exports = { buildDriver, waitAndFind, typeInto, clickWhenClickable, By, until };
