const express = require('express');
const router = express.Router();
const settingController = require('../controllers/setting.controller');
const { verifyAdminToken } = require('../config/token');
const upload = require('../config/upload');

router.get('/admin/get-setting', verifyAdminToken, settingController.getAllSettings);
router.post('/admin/setting', verifyAdminToken, settingController.createOrUpdateSetting); 
router.get('/user/xlsx',  settingController.downloadSettingsExcelFile);


router.post('/upload-file', upload.array('files', 10), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ success: false, message: 'No files uploaded' });
  }

  const baseUrl = "http://10.187.121.187:3001/uploads";
  const uploadedFiles = req.files.map(file => ({
    file: file.filename,
    path: file.path,
    url: `${baseUrl}/${file.filename}`
  }));

  res.status(200).json({
    success: true,
    files: uploadedFiles
  });
});

router.use((err, req, res, next) => {
  if (err.message.includes('Only image, video, and Excel')) {
    return res.status(400).json({ success: false, message: err.message });
  }
  next(err);
});

module.exports = router;