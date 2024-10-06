const express = require('express');
const validate = require('../middlewares/validate');
const auth = require('../middlewares/auth');
const { userController } = require('../controllers');

const router = express.Router();

router.post('/', userController.createNewUser);
router.get('/', userController.getAllusers);
router.get('/getAllRoles', userController.getRoles)
router.get('/changeStatus/:id', userController.changeStatus)
router.put('/:id', userController.updateUser)
module.exports = router;
