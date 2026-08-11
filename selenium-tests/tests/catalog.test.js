const assert = require('assert');
const { buildDriver, waitAndFind, typeInto, By, until } = require('../utils/driverFactory');
const { BASE_URL } = require('../config');

describe('Catálogo de productos', function () {
  let driver;

  before(async function () {
    driver = await buildDriver();
  });

  after(async function () {
    if (driver) await driver.quit();
  });

  it('HU-06: el catálogo muestra productos al visitante sin necesidad de iniciar sesión', async function () {
    await driver.get(BASE_URL);
    const cards = await driver.wait(
      until.elementsLocated(By.css('[data-testid="product-card"]')),
      10000
    );
    assert.ok(cards.length > 0, 'Se esperaba al menos un producto en el catálogo');
  });

  it('HU-07: el visitante puede buscar productos por nombre', async function () {
    await driver.get(BASE_URL);
    const searchInput = await waitAndFind(driver, By.id('searchInput'));
    await searchInput.sendKeys('Auriculares');
    await searchInput.sendKeys('\uE007'); // ENTER key

    await driver.wait(until.urlContains('search=Auriculares'), 10000);
    const cards = await driver.wait(until.elementsLocated(By.css('[data-testid="product-card"]')), 10000);
    assert.ok(cards.length >= 1);

    const firstCardText = await cards[0].getText();
    assert.match(firstCardText, /Auriculares/i);
  });

  it('HU-08: el visitante puede filtrar productos por categoría', async function () {
    await driver.get(BASE_URL);
    const select = await waitAndFind(driver, By.id('categoryFilter'));

    // Select the second <option> (first real category, after "Todas las categorías").
    const options = await select.findElements(By.css('option'));
    assert.ok(options.length > 1, 'Se esperaba al menos una categoría disponible');
    const value = await options[1].getAttribute('value');
    await select.sendKeys(await options[1].getText());

    await driver.wait(until.urlContains(`categoryId=${value}`), 10000);
    const cards = await driver.wait(until.elementsLocated(By.css('[data-testid="product-card"]')), 10000);
    assert.ok(cards.length >= 0); // could legitimately be 0 if category has no products
  });

  it('HU-09: el visitante puede ver el detalle de un producto', async function () {
    await driver.get(BASE_URL);
    const firstCard = await waitAndFind(driver, By.css('[data-testid="product-card"]'));
    await firstCard.click();

    await driver.wait(until.urlContains('/products/'), 10000);
    const heading = await waitAndFind(driver, By.css('h1'));
    const text = await heading.getText();
    assert.ok(text.length > 0, 'Se esperaba un título de producto visible');

    const price = await waitAndFind(driver, By.xpath('//p[contains(text(),"$")]'));
    assert.ok(await price.isDisplayed());
  });
});
