const express = require('express');
const router = express.Router();
const ratingController = require('../controllers/rating.controller');
const { verifyAdminToken } = require('../config/token');

// CRUD Routes
router.post('/admin/create-review',verifyAdminToken, ratingController.createRating);
router.get('/admin/review-list',verifyAdminToken, ratingController.getAllRatings);
router.get('/admin/review/:id',verifyAdminToken, ratingController.getRatingById);
router.put('/admin/review/:id',verifyAdminToken, ratingController.updateRating);
router.delete('/admin/review/:id',verifyAdminToken, ratingController.deleteRating);

router.get('/user/reviews', ratingController.getAllRatingsUser);


module.exports = router;
