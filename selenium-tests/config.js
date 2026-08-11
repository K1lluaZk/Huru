/**
 * Configuración centralizada para las pruebas E2E de ShopHub.
 * Ajusta BASE_URL si el frontend corre en otro puerto/host.
 */
module.exports = {
  BASE_URL: process.env.SHOPHUB_URL || 'http://localhost:5173',
  IMPLICIT_WAIT_MS: 5000,
  EXPLICIT_WAIT_MS: 10000,
  CLIENT_USER: {
    email: process.env.SHOPHUB_CLIENT_EMAIL || 'cliente@huru.com',
    password: process.env.SHOPHUB_CLIENT_PASSWORD || 'Client123!',
  },
  ADMIN_USER: {
    email: process.env.SHOPHUB_ADMIN_EMAIL || 'admin@huru.com',
    password: process.env.SHOPHUB_ADMIN_PASSWORD || 'Admin123!',
  },
  // A new random user is generated per test run to test the registration flow.
  newRandomUser: () => {
    const suffix = Date.now();
    return {
      name: `Usuario Prueba ${suffix}`,
      email: `usuario.prueba.${suffix}@huru.com`,
      password: 'Prueba123!',
    };
  },
};
