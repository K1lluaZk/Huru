const { Router } = require('express');
const { register, login, me } = require('../controllers/auth.controller');
const { registerRules, loginRules } = require('../validators/auth.validators');
const validate = require('../middleware/validate');
const { authenticate } = require('../middleware/auth');

const router = Router();

router.post('/register', registerRules, validate, register);
router.post('/login', loginRules, validate, login);
router.get('/me', authenticate, me);

module.exports = router;
