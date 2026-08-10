const { Router } = require('express');
const {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} = require('../controllers/cart.controller');
const { addToCartRules, updateCartItemRules } = require('../validators/order.validators');
const validate = require('../middleware/validate');
const { authenticate, authorize } = require('../middleware/auth');

const router = Router();

// Cart is a personal, persisted resource for authenticated clients.
router.use(authenticate, authorize('CLIENT'));

router.get('/', getCart);
router.post('/', addToCartRules, validate, addToCart);
router.put('/:itemId', updateCartItemRules, validate, updateCartItem);
router.delete('/:itemId', removeCartItem);
router.delete('/', clearCart);

module.exports = router;
