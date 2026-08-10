const ApiError = require('../utils/ApiError');

/**
 * 404 handler for unmatched routes.
 */
const notFound = (req, res, next) => {
  next(ApiError.notFound(`Ruta no encontrada: ${req.method} ${req.originalUrl}`));
};

/**
 * Centralized error handler. Must be registered last, after all routes.
 * Normalizes Prisma errors, validation errors and unexpected exceptions
 * into a consistent JSON response shape.
 */
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Error interno del servidor';
  let details = err.details || null;

  // Prisma known request errors (e.g. unique constraint violations)
  if (err.code === 'P2002') {
    statusCode = 409;
    message = `Ya existe un registro con ese valor: ${err.meta?.target?.join(', ') || ''}`;
  }
  if (err.code === 'P2025') {
    statusCode = 404;
    message = 'Registro no encontrado';
  }

  if (process.env.NODE_ENV === 'development' && statusCode === 500) {
    console.error(err);
  }

  res.status(statusCode).json({
    success: false,
    message,
    details,
  });
};

module.exports = { notFound, errorHandler };
