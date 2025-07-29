const express = require('express');
const router = express.Router();
const formController = require('../controllers/form.controller');
const { verifyAdminToken, verifyUserToken } = require('../config/token');

router.post('/user/form', formController.createform);
router.get('/admin/form-list',verifyAdminToken, formController.getAllform);
router.delete('/admin/delete-form-list/:id',verifyAdminToken, formController.delete);
 
module.exports = router;
