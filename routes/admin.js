const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authController = require('../controllers/authController');

// Trang tổng quan admin (bảo vệ bằng session)
router.get('/', authController.requireAdmin, adminController.getDashboard);
// Trang quản lý user (bảo vệ bằng session)
router.get('/users', authController.requireAdmin, (req, res, next) => {
  req.renderView = 'users';
  next();
}, adminController.getUserList);
// Xử lý cập nhật vai trò user (bảo vệ bằng session)
router.post('/update-role', authController.requireAdmin, adminController.updateUserRole);

module.exports = router;
