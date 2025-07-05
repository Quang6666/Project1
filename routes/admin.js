const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// Trang tổng quan admin
router.get('/', adminController.getDashboard);
// Trang quản lý user
router.get('/users', (req, res, next) => {
  req.renderView = 'users';
  next();
}, adminController.getUserList);
// Xử lý cập nhật vai trò user
router.post('/update-role', adminController.updateUserRole);

module.exports = router;
