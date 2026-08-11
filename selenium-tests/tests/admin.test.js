const assert = require('assert');
const { buildDriver, waitAndFind, typeInto, clickWhenClickable, By, until } = require('../utils/driverFactory');
const { BASE_URL, ADMIN_USER } = require('../config');

async function loginAsAdmin(driver) {
  await driver.get(`${BASE_URL}/login`);
  await typeInto(driver, By.id('email'), ADMIN_USER.email);
  await typeInto(driver, By.id('password'), ADMIN_USER.password);
  await clickWhenClickable(driver, By.css('button[type="submit"]'));
  await driver.wait(until.urlIs(`${BASE_URL}/`), 10000);
}

describe('Panel administrativo', function () {
  let driver;
  const testProductName = `Producto E2E ${Date.now()}`;

  before(async function () {
    driver = await buildDriver();
    await loginAsAdmin(driver);
  });

  after(async function () {
    if (driver) await driver.quit();
  });

  it('HU-17: el dashboard administrativo muestra las métricas principales', async function () {
    await driver.get(`${BASE_URL}/admin`);
    const heading = await waitAndFind(driver, By.xpath('//h1[contains(text(),"Dashboard administrativo")]'));
    assert.ok(await heading.isDisplayed());

    const metricLabels = await driver.wait(
      until.elementsLocated(By.xpath('//p[contains(@class,"uppercase")]')),
      10000
    );
    assert.ok(metricLabels.length >= 4, 'Se esperaban al menos 4 tarjetas de métricas');
  });

  it('HU-18: un administrador puede crear un nuevo producto', async function () {
    await driver.get(`${BASE_URL}/admin/products`);
    await clickWhenClickable(driver, By.xpath('//button[contains(text(),"Nuevo producto")]'));

    const modal = await waitAndFind(driver, By.xpath('//h2[contains(text(),"Nuevo producto")]'));
    assert.ok(await modal.isDisplayed());

    const nameInputs = await driver.findElements(By.xpath('//label[contains(text(),"Nombre")]/following-sibling::input'));
    await nameInputs[0].sendKeys(testProductName);

    const descriptionInput = await driver.findElement(
      By.xpath('//label[contains(text(),"Descripción")]/following-sibling::textarea')
    );
    await descriptionInput.sendKeys('Producto creado por prueba automatizada Selenium');

    const priceInput = await driver.findElement(By.xpath('//label[contains(text(),"Precio")]/following-sibling::input'));
    await priceInput.clear();
    await priceInput.sendKeys('9.99');

    const stockInput = await driver.findElement(By.xpath('//label[contains(text(),"Stock")]/following-sibling::input'));
    await stockInput.clear();
    await stockInput.sendKeys('20');

    await clickWhenClickable(driver, By.xpath('//button[contains(text(),"Crear producto")]'));

    const successAlert = await waitAndFind(driver, By.css('[role="alert"]'));
    const text = await successAlert.getText();
    assert.match(text, /Producto creado/i);

    const rows = await driver.wait(until.elementsLocated(By.css('[data-testid="admin-product-row"]')), 10000);
    const rowsText = await Promise.all(rows.map((r) => r.getText()));
    assert.ok(rowsText.some((t) => t.includes(testProductName)));
  });

  it('HU-19: un administrador puede editar un producto existente', async function () {
    await driver.get(`${BASE_URL}/admin/products`);
    const targetRow = await waitAndFind(driver, By.xpath(`//tr[contains(., "${testProductName}")]`));
    const editButton = await targetRow.findElement(By.xpath('.//button[contains(text(),"Editar")]'));
    await editButton.click();

    const priceInput = await waitAndFind(
      driver,
      By.xpath('//label[contains(text(),"Precio")]/following-sibling::input')
    );
    await priceInput.clear();
    await priceInput.sendKeys('14.99');

    await clickWhenClickable(driver, By.xpath('//button[contains(text(),"Guardar cambios")]'));

    const successAlert = await waitAndFind(driver, By.css('[role="alert"]'));
    const text = await successAlert.getText();
    assert.match(text, /Producto actualizado/i);
  });

  it('HU-20: un administrador puede cambiar el estado de un pedido', async function () {
    await driver.get(`${BASE_URL}/admin/orders`);
    const orderRows = await driver.wait(until.elementsLocated(By.css('[data-testid="admin-order-list"] > div')), 10000);

    if (orderRows.length === 0) {
      this.skip(); // No orders exist yet to manage in this environment.
    }

    const statusSelect = await orderRows[0].findElement(By.css('select'));
    await statusSelect.sendKeys('PROCESSING');

    const successAlert = await waitAndFind(driver, By.css('[role="alert"]'));
    const text = await successAlert.getText();
    assert.match(text, /actualizado a/i);
  });

  it('HU-21: un administrador puede eliminar (dar de baja) un producto', async function () {
    await driver.get(`${BASE_URL}/admin/products`);
    const targetRow = await waitAndFind(driver, By.xpath(`//tr[contains(., "${testProductName}")]`));
    const deleteButton = await targetRow.findElement(By.xpath('.//button[contains(text(),"Eliminar")]'));

    await driver.executeScript('window.confirm = () => true;'); // auto-accept the confirm dialog
    await deleteButton.click();

    const successAlert = await waitAndFind(driver, By.css('[role="alert"]'));
    const text = await successAlert.getText();
    assert.match(text, /Producto eliminado/i);
  });
});
