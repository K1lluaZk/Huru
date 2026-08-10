const { Router } = require('express');
const { listCategories, createCategory, deleteCategory } = require('../controllers/category.controller');
const { categoryRules } = require('../validators/category.validators');
const validate = require('../middleware/validate');
const { authenticate, authorize } = require('../middleware/auth');

const router = Router();

router.get('/', listCategories);
router.post('/', authenticate, authorize('ADMIN'), categoryRules, validate, createCategory);
router.delete('/:id', authenticate, authorize('ADMIN'), deleteCategory);

module.exports = router;
