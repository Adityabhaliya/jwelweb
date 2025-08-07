const express = require('express');
const router = express.Router();
const faqController = require('../controllers/faq.controller');
const { verifyAdminToken, verifyUserToken } = require('../config/token');

router.post('/admin/create-faq',verifyAdminToken, faqController.createFaq);
router.put('/admin/faq/:id', verifyAdminToken,faqController.updateFaq);
router.get('/admin/faq-list', faqController.getAllFaqs);
router.get('/admin/faq/:id', verifyAdminToken,faqController.getFaqById);
router.delete('/admin/faq/:id',verifyAdminToken, faqController.deleteFaq);


router.get('/user/faq-list', faqController.getAllFaqsUser);

module.exports = router;
 
 


 