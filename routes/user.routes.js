 

const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { verifyAdminToken, verifyUserToken } = require('../config/token');

// Public routes
router.post('/user/register', userController.register);
router.post('/user/login', userController.login);
router.post('/admin/login', userController.adminlogin);
router.post('/admin/forget-password', userController.forgetPassword);  

router.put('/admin/reset-password', userController.resetPassword); 
router.post('/admin/change-password',verifyAdminToken, userController.resetChangePassword); 
// Protected routes
router.get('/admin/profile', verifyAdminToken, userController.getProfile);
router.get('/user/profile', verifyUserToken, userController.getProfile); 
router.put('/admin/profile', verifyAdminToken, userController.updateAdminProfile);

router.get('/admin/access', verifyAdminToken, userController.access);
router.post('/admin/create-subadmin',verifyAdminToken, userController.createSubadmin);
router.patch('/admin/change-subadmin-password/:id',verifyAdminToken, userController.changeSubadminPassword);

module.exports = router;
