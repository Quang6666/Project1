const express = require('express');
const router = express.Router();
const authController = require('../3_controllers/authController');

// API login
router.post('/login', authController.loginApi);

// Trang login
router.get('/login', authController.loginPage);
router.post('/login', authController.loginPagePost);

module.exports = router;
