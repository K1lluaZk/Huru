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

describe('Checkout e historial de pedidos', function () {
  let driver;

  before(async function () {
    driver = await buildDriver();
    await loginAsClient(driver);
  });

  after(async function () {
    if (driver) await driver.quit();
  });

  it('HU-14: un cliente puede crear un pedido a partir del carrito', async function () {
    // Ensure there is at least one item in the cart before checking out.
    await driver.get(BASE_URL);
    const firstCard = await waitAndFind(driver, By.css('[data-testid="product-card"]'));
    await firstCard.click();
    await driver.wait(until.urlContains('/products/'), 10000);
    await clickWhenClickable(driver, By.css('[data-testid="add-to-cart-button"]'));
    await waitAndFind(driver, By.css('[role="alert"]'));

    await driver.get(`${BASE_URL}/cart`);
    await clickWhenClickable(driver, By.xpath('//button[contains(text(),"Continuar con la compra")]'));
    await driver.wait(until.urlContains('/checkout'), 10000);

    await typeInto(driver, By.id('shippingAddress'), 'Av. Siempre Viva 123, Ciudad Demo');
    await clickWhenClickable(driver, By.xpath('//button[contains(text(),"Confirmar pedido")]'));

    await driver.wait(until.urlMatches(/\/orders\/\d+/), 15000);
    const successAlert = await waitAndFind(driver, By.css('[role="alert"]'));
    const text = await successAlert.getText();
    assert.match(text, /pedido fue creado exitosamente/i);
  });

  it('HU-15: el pedido recién creado aparece en el historial del cliente', async function () {
    await driver.get(`${BASE_URL}/orders`);
    const orderList = await waitAndFind(driver, By.css('[data-testid="order-list"]'));
    const text = await orderList.getText();
    assert.match(text, /Pedido #/i);
  });

  it('HU-16: el cliente puede ver el detalle de un pedido pasado', async function () {
    await driver.get(`${BASE_URL}/orders`);
    const firstOrderLink = await waitAndFind(driver, By.css('[data-testid="order-list"] a'));
    await firstOrderLink.click();

    await driver.wait(until.urlMatches(/\/orders\/\d+/), 10000);
    const heading = await waitAndFind(driver, By.xpath('//h1[contains(text(),"Pedido #")]'));
    assert.ok(await heading.isDisplayed());
  });
});
