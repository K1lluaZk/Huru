const { validationResult } = require('express-validator');
const ApiError = require('../utils/ApiError');

/**
 * Runs after express-validator's chain of checks.
 * If any validation failed, responds with 400 and the list of field errors.
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const details = errors.array().map((e) => ({ field: e.path, message: e.msg }));
    return next(ApiError.badRequest('Error de validación', details));
  }
  next();
};

module.exports = validate;
