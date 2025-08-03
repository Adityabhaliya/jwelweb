const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const { verifyAdminToken } = require('../config/token');

router.post('/admin/product',verifyAdminToken, productController.createProduct);
router.get('/admin/product',verifyAdminToken, productController.getAllProducts);
router.get('/admin/product/:slug',verifyAdminToken, productController.getProductBySlug);
router.put('/admin/product/:slug',verifyAdminToken, productController.updateProductBySlug);
router.delete('/admin/product/:slug',verifyAdminToken, productController.deleteProductBySlug);

router.get('/user/product', productController.getAllProductsUser); 
router.get('/user/globel-product', productController.getAllProductsUserGlobel);
router.get('/user/category-product', productController.getAllProductsUserCatSlug);
router.get('/user/recommand-product', productController.getAllProductsUserRecommand);
router.get('/user/product-details/:slug',verifyAdminToken, productController.getProductBySlugUser);


module.exports = router;
