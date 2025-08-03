const express = require('express');
const router = express.Router();
const categoryCtrl = require('../controllers/category.controller');
const { verifyAdminToken } = require('../config/token');

router.post('/admin/category',verifyAdminToken, categoryCtrl.createCategory);
router.get('/admin/category',verifyAdminToken, categoryCtrl.getAllCategories); 
router.get('/admin/sub-category',verifyAdminToken, categoryCtrl.getAllSubCategories);
router.get('/admin/category/:slug',verifyAdminToken, categoryCtrl.getCategoryBySlug); 
router.get('/admin/drop-category',verifyAdminToken, categoryCtrl.getCategorydropdwon);
router.put('/admin/category/:slug',verifyAdminToken, categoryCtrl.updateCategoryBySlug);
router.delete('/admin/category/:slug',verifyAdminToken, categoryCtrl.deleteCategoryBySlug);

module.exports = router;
