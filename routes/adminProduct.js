const express = require('express');
const router = express.Router();
const adminProductController = require('../controllers/adminProductController');

// Trang quản lý sản phẩm & danh mục
router.get('/products', adminProductController.productAdminPage);

// Danh mục
router.post('/categories/add', adminProductController.addCategory);
router.get('/categories/edit/:id', adminProductController.editCategoryPage);
router.post('/categories/edit/:id', adminProductController.editCategory);
router.get('/categories/delete/:id', adminProductController.deleteCategory);

// Sản phẩm
router.get('/products/add', adminProductController.addProductPage);
router.post('/products/add', adminProductController.addProduct);
router.get('/products/edit/:id', adminProductController.editProductPage);
router.post('/products/edit/:id', adminProductController.editProduct);
router.get('/products/delete/:id', adminProductController.deleteProduct);

module.exports = router;
