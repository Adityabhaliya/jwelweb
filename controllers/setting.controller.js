 
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
    const { key, value } = req.body;

    if (!key) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: 'Key is required',
      });
    }

    const [setting, created] = await Setting.findOrCreate({
      where: { key },
      defaults: { value },
    });

    if (!created) {
      await setting.update({ value });
    }

    res.status(200).json({
      success: true,
      status: 200,
      message: created ? 'Setting created' : 'Setting updated',
      data: setting,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      status: 500,
      message: 'Failed to create or update setting',
    });
  }
};
