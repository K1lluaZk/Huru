const assert = require('assert');
const { buildDriver, waitAndFind, typeInto, clickWhenClickable, By, until } = require('../utils/driverFactory');
const { BASE_URL, CLIENT_USER, newRandomUser } = require('../config');

describe('Autenticación (Registro / Login / Logout)', function () {
  let driver;

  before(async function () {
    driver = await buildDriver();
  });

  after(async function () {
    if (driver) await driver.quit();
  });

  it('HU-01: un visitante puede registrarse con datos válidos', async function () {
    const user = newRandomUser();
    await driver.get(`${BASE_URL}/register`);

    await typeInto(driver, By.id('name'), user.name);
    await typeInto(driver, By.id('email'), user.email);
    await typeInto(driver, By.id('password'), user.password);
    await typeInto(driver, By.id('confirmPassword'), user.password);
    await clickWhenClickable(driver, By.css('button[type="submit"]'));

    // A successful registration logs the user in and redirects to the catalog.
    await driver.wait(until.urlIs(`${BASE_URL}/`), 10000);
    const cartLink = await waitAndFind(driver, By.css('[data-testid="cart-link"]'));
    assert.ok(await cartLink.isDisplayed(), 'Se esperaba ver el enlace del carrito tras registrarse');
  });

  it('HU-02: el registro con contraseñas que no coinciden muestra un error', async function () {
    const user = newRandomUser();
    await driver.get(`${BASE_URL}/register`);

    await typeInto(driver, By.id('name'), user.name);
    await typeInto(driver, By.id('email'), user.email);
    await typeInto(driver, By.id('password'), user.password);
    await typeInto(driver, By.id('confirmPassword'), 'OtraClave123!');
    await clickWhenClickable(driver, By.css('button[type="submit"]'));

    const alert = await waitAndFind(driver, By.css('[role="alert"]'));
    const text = await alert.getText();
    assert.match(text, /no coinciden/i);
  });

  it('HU-03: un cliente existente puede iniciar sesión con credenciales válidas', async function () {
    await driver.get(`${BASE_URL}/login`);
    await typeInto(driver, By.id('email'), CLIENT_USER.email);
    await typeInto(driver, By.id('password'), CLIENT_USER.password);
    await clickWhenClickable(driver, By.css('button[type="submit"]'));

    await driver.wait(until.urlIs(`${BASE_URL}/`), 10000);
    const cartLink = await waitAndFind(driver, By.css('[data-testid="cart-link"]'));
    assert.ok(await cartLink.isDisplayed());
  });

  it('HU-04: el login con credenciales inválidas muestra un mensaje de error', async function () {
    await driver.get(`${BASE_URL}/login`);
    await typeInto(driver, By.id('email'), CLIENT_USER.email);
    await typeInto(driver, By.id('password'), 'ClaveIncorrecta999');
    await clickWhenClickable(driver, By.css('button[type="submit"]'));

    const alert = await waitAndFind(driver, By.css('[role="alert"]'));
    const text = await alert.getText();
    assert.match(text, /credenciales inválidas/i);
  });

  it('HU-05: un cliente autenticado puede cerrar sesión', async function () {
    await driver.get(`${BASE_URL}/login`);
    await typeInto(driver, By.id('email'), CLIENT_USER.email);
    await typeInto(driver, By.id('password'), CLIENT_USER.password);
    await clickWhenClickable(driver, By.css('button[type="submit"]'));
    await driver.wait(until.urlIs(`${BASE_URL}/`), 10000);

    await clickWhenClickable(driver, By.xpath('//button[contains(text(),"Salir")]'));

    const loginLink = await waitAndFind(driver, By.xpath('//a[contains(text(),"Ingresar")]'));
    assert.ok(await loginLink.isDisplayed(), 'Se esperaba ver el enlace de "Ingresar" tras cerrar sesión');
  });
});
