const { body, query } = require('express-validator');

const createProductRules = [
  body('name').trim().notEmpty().withMessage('El nombre es obligatorio'),
  body('description').trim().notEmpty().withMessage('La descripción es obligatoria'),
  body('price')
    .isFloat({ gt: 0 })
    .withMessage('El precio debe ser un número mayor a 0'),
  body('stock')
    .isInt({ min: 0 })
    .withMessage('El stock debe ser un número entero mayor o igual a 0'),
  body('categoryId').isInt({ gt: 0 }).withMessage('Debe indicar una categoría válida'),
  body('imageUrl').optional({ nullable: true, checkFalsy: true }).isURL().withMessage('imageUrl debe ser una URL válida'),
];

const updateProductRules = [
  body('name').optional().trim().notEmpty().withMessage('El nombre no puede estar vacío'),
  body('description').optional().trim().notEmpty().withMessage('La descripción no puede estar vacía'),
  body('price').optional().isFloat({ gt: 0 }).withMessage('El precio debe ser un número mayor a 0'),
  body('stock').optional().isInt({ min: 0 }).withMessage('El stock debe ser un número entero mayor o igual a 0'),
  body('categoryId').optional().isInt({ gt: 0 }).withMessage('Debe indicar una categoría válida'),
  body('imageUrl').optional({ nullable: true, checkFalsy: true }).isURL().withMessage('imageUrl debe ser una URL válida'),
];

const listProductsRules = [
  query('page').optional().isInt({ min: 1 }).withMessage('page debe ser un entero >= 1'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('limit debe estar entre 1 y 100'),
  query('categoryId').optional().isInt({ gt: 0 }).withMessage('categoryId inválido'),
];

module.exports = { createProductRules, updateProductRules, listProductsRules };
