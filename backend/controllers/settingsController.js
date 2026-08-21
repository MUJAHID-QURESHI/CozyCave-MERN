const Settings = require('../models/Settings');

// @desc    Get portal settings
// @route   GET /api/settings
// @access  Public
const getSettings = async (req, res, next) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      // Create default settings row if not exists
      settings = await Settings.create({});
    }
    res.status(200).json({
      success: true,
      message: 'Settings fetched successfully',
      data: settings
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update portal settings (Admin only)
// @route   PUT /api/settings
// @access  Private/Admin
const updateSettings = async (req, res, next) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings({});
    }

    const {
      portalName, supportEmail, supportPhone, supportAddress,
      whatsappLink, taxPercent, serviceFeePercent, maintenanceMode
    } = req.body;

    settings.portalName = portalName !== undefined ? portalName : settings.portalName;
    settings.supportEmail = supportEmail !== undefined ? supportEmail : settings.supportEmail;
    settings.supportPhone = supportPhone !== undefined ? supportPhone : settings.supportPhone;
    settings.supportAddress = supportAddress !== undefined ? supportAddress : settings.supportAddress;
    settings.whatsappLink = whatsappLink !== undefined ? whatsappLink : settings.whatsappLink;
    settings.taxPercent = taxPercent !== undefined ? parseFloat(taxPercent) : settings.taxPercent;
    settings.serviceFeePercent = serviceFeePercent !== undefined ? parseFloat(serviceFeePercent) : settings.serviceFeePercent;
    settings.maintenanceMode = maintenanceMode !== undefined ? !!maintenanceMode : settings.maintenanceMode;

    await settings.save();

    res.status(200).json({
      success: true,
      message: 'Settings updated successfully',
      data: settings
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSettings,
  updateSettings
};
