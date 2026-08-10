const { body } = require('express-validator');

const addToCartRules = [
  body('productId').isInt({ gt: 0 }).withMessage('productId es obligatorio y debe ser válido'),
  body('quantity')
    .optional()
    .isInt({ min: 1 })
    .withMessage('quantity debe ser un entero mayor o igual a 1'),
];

const updateCartItemRules = [
  body('quantity').isInt({ min: 1 }).withMessage('quantity debe ser un entero mayor o igual a 1'),
];

const createOrderRules = [
  body('shippingAddress')
    .trim()
    .notEmpty()
    .withMessage('La dirección de envío es obligatoria')
    .isLength({ min: 5, max: 200 })
    .withMessage('La dirección debe tener entre 5 y 200 caracteres'),
];

const updateOrderStatusRules = [
  body('status')
    .isIn(['PENDING', 'PROCESSING', 'COMPLETED', 'CANCELLED'])
    .withMessage('Estado de pedido inválido'),
];

module.exports = {
  addToCartRules,
  updateCartItemRules,
  createOrderRules,
  updateOrderStatusRules,
};
