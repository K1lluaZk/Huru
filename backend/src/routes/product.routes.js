const { Router } = require('express');
const {
  listProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/product.controller');
const {
  createProductRules,
  updateProductRules,
  listProductsRules,
} = require('../validators/product.validators');
const validate = require('../middleware/validate');
const { authenticate, authorize } = require('../middleware/auth');

const router = Router();

// Public
router.get('/', listProductsRules, validate, listProducts);
router.get('/:id', getProductById);

// Admin only
router.post('/', authenticate, authorize('ADMIN'), createProductRules, validate, createProduct);
router.put('/:id', authenticate, authorize('ADMIN'), updateProductRules, validate, updateProduct);
router.delete('/:id', authenticate, authorize('ADMIN'), deleteProduct);

module.exports = router;
