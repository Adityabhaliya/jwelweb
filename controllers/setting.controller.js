 
const { Setting } = require('../models');

exports.getAllSettings = async (req, res) => {
  try {
    const settings = await Setting.findAll({
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      success: true,
      status: 200,
      data: settings,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      status: 500,
      message: 'Failed to fetch settings',
    });
  }
};



exports.createOrUpdateSetting = async (req, res) => {
  try {
    const settings = Array.isArray(req.body) ? req.body : [req.body];

    const results = [];

    for (const item of settings) {
      const { key, value } = item;

      if (!key) {
        results.push({
          key,
          success: false,
          message: 'Key is missing',
        });
        continue;
      }

      const [setting, created] = await Setting.findOrCreate({
        where: { key },
        defaults: { value },
      });

      if (!created) {
        await setting.update({ value });
      }

      results.push({
        key,
        success: true,
        message: created ? 'Setting created' : 'Setting updated',
        data: setting,
      });
    }

    res.status(200).json({
      success: true,
      status: 200,
      message: 'Settings processed successfully',
      results,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      status: 500,
      message: 'Failed to process settings',
      error: err.message,
    });
  }
};

exports.downloadSettingsExcelFile = async (req, res) => {
  try {
    const fileName = '1753806438811-710153978.xlsx';
    const filePath = path.join(__dirname, '..', 'upload', fileName);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        status: 404,
        message: 'File not found',
      });
    }

    res.download(filePath, fileName); // This sends the file as download

  } catch (error) {
    console.error('Error sending file:', error);
    res.status(500).json({
      success: false,
      status: 500,
      message: 'Failed to download file',
      error: error.message,
    });
  }
};
