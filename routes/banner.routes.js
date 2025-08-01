const express = require('express');
const router = express.Router();
const bannerController = require('../controllers/banner.controller');
const { verifyAdminToken } = require('../config/token');

router.post('/admin/banner',verifyAdminToken, bannerController.createBanner);
router.get('/admin/banner',verifyAdminToken, bannerController.getAllBanners);
router.get('/admin/banner/:id',verifyAdminToken, bannerController.getBannerById);
router.put('/admin/banner/:id',verifyAdminToken, bannerController.updateBanner);
router.delete('/admin/banner/:id',verifyAdminToken, bannerController.deleteBanner);

module.exports = router;
