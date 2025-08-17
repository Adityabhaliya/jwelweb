const express = require('express');
const router = express.Router();

router.use('/', require('./product.routes'));
router.use('/', require('./user.routes'));
router.use('/', require('./category.routes'));
router.use('/', require('./setting.routes'));
router.use('/', require('./form.routes'));
router.use('/', require('./banner.routes'));
router.use('/', require('./faq.routes'));
router.use('/', require('./rating.routes'));




module.exports = router;
