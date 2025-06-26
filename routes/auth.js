const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// API login
router.post('/login', authController.loginApi);

// API register
router.post('/register', authController.registerApi);

// Trang login
router.get('/login', authController.loginPage);
router.post('/login', authController.loginPagePost);

module.exports = router;
