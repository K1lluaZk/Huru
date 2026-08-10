const { body } = require('express-validator');

const categoryRules = [
  body('name').trim().notEmpty().withMessage('El nombre de la categoría es obligatorio'),
];

module.exports = { categoryRules };
