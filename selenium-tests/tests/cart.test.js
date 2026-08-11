const assert = require('assert');
const { buildDriver, waitAndFind, typeInto, clickWhenClickable, By, until } = require('../utils/driverFactory');
const { BASE_URL, CLIENT_USER } = require('../config');

async function loginAsClient(driver) {
  await driver.get(`${BASE_URL}/login`);
  await typeInto(driver, By.id('email'), CLIENT_USER.email);
  await typeInto(driver, By.id('password'), CLIENT_USER.password);
  await clickWhenClickable(driver, By.css('button[type="submit"]'));
  await driver.wait(until.urlIs(`${BASE_URL}/`), 10000);
}

describe('Carrito de compras', function () {
  let driver;

  before(async function () {
    driver = await buildDriver();
    await loginAsClient(driver);
    // Start each suite from a clean cart state.
    await driver.get(`${BASE_URL}/cart`);
  });

  after(async function () {
    if (driver) await driver.quit();
  });

  it('HU-10: un cliente puede agregar un producto al carrito', async function () {
    await driver.get(BASE_URL);
    const firstCard = await waitAndFind(driver, By.css('[data-testid="product-card"]'));
    await firstCard.click();
    await driver.wait(until.urlContains('/products/'), 10000);

    await clickWhenClickable(driver, By.css('[data-testid="add-to-cart-button"]'));
    const successAlert = await waitAndFind(driver, By.css('[role="alert"]'));
    const text = await successAlert.getText();
    assert.match(text, /agregado al carrito/i);
  });

  it('HU-11: el carrito refleja el producto agregado y el total calculado', async function () {
    await clickWhenClickable(driver, By.css('[data-testid="cart-link"]'));
    await driver.wait(until.urlContains('/cart'), 10000);

    const items = await driver.wait(until.elementsLocated(By.css('[data-testid="cart-item"]')), 10000);
    assert.ok(items.length >= 1, 'Se esperaba al menos un artículo en el carrito');

    const total = await waitAndFind(driver, By.css('[data-testid="cart-total"]'));
    const totalText = await total.getText();
    assert.match(totalText, /^\$\d+\.\d{2}$/);
  });

  it('HU-12: un cliente puede aumentar la cantidad de un producto en el carrito', async function () {
    const quantityBefore = await (await waitAndFind(driver, By.css('[data-testid="item-quantity"]'))).getText();
    const increaseButton = await waitAndFind(driver, By.xpath('//button[text()="+"]'));

    await increaseButton.click();
    await driver.wait(async () => {
        try {
            const quantityAfter = await (await driver.findElement(By.css('[data-testid="item-quantity"]'))).getText();
            return quantityAfter !== quantityBefore;
        } catch (error) {
            if (error.name === 'StaleElementReferenceError') {
                return false;
            }
            throw error;
        }
    }, 15000);
  });

  it('HU-13: un cliente puede eliminar un producto del carrito', async function () {
    const removeButton = await waitAndFind(driver, By.xpath('//button[contains(text(),"Eliminar")]'));

    await removeButton.click();
    await driver.wait(
        until.elementLocated(By.xpath('//h1[contains(text(),"carrito está vacío")]')),
        15000
    );
  });
})