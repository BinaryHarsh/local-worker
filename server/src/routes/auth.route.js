const express = require('express');
const validate = require('../middlewares/validate');
const auth = require('../middlewares/auth');
const authValidation = require('../validations/auth.validation');
const authController = require('../controllers/auth.controller');

const router = express.Router();

router.post('/session', auth('session'), (req, res) => res.send(true));
router.post('/login', validate(authValidation.login), authController.login);
router.post('/logout', validate(authValidation.logout), authController.logout);

module.exports = router;
