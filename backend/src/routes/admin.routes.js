const { Router } = require('express');
const { getDashboardStats } = require('../controllers/admin.controller');
const { getAllOrders, updateOrderStatus } = require('../controllers/order.controller');
const { updateOrderStatusRules } = require('../validators/order.validators');
const validate = require('../middleware/validate');
const { authenticate, authorize } = require('../middleware/auth');

const router = Router();

router.use(authenticate, authorize('ADMIN'));

router.get('/dashboard', getDashboardStats);
router.get('/orders', getAllOrders);
router.put('/orders/:id/status', updateOrderStatusRules, validate, updateOrderStatus);

module.exports = router;
