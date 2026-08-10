const { Router } = require('express');
const { createOrder, getMyOrders, getMyOrderById } = require('../controllers/order.controller');
const { createOrderRules } = require('../validators/order.validators');
const validate = require('../middleware/validate');
const { authenticate, authorize } = require('../middleware/auth');

const router = Router();

router.use(authenticate, authorize('CLIENT'));

router.post('/', createOrderRules, validate, createOrder);
router.get('/', getMyOrders);
router.get('/:id', getMyOrderById);

module.exports = router;
