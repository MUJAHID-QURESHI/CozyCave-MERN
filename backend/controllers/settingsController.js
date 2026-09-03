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
    if (!settings.supportPhones || settings.supportPhones.length === 0) {
      settings.supportPhones = settings.supportPhone 
        ? [settings.supportPhone] 
        : ['+1 (828) 555-0173', '+1 (828) 555-0174', '+1 (828) 555-0175'];
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
      portalName, supportEmail, supportPhone, supportPhones, supportAddress,
      whatsappLink, serviceFeePercent, bookingWindowMonths, maintenanceMode
    } = req.body;

    settings.portalName = portalName !== undefined ? portalName : settings.portalName;
    settings.supportEmail = supportEmail !== undefined ? supportEmail : settings.supportEmail;
    
    if (supportPhones !== undefined) {
      const filtered = Array.isArray(supportPhones)
        ? supportPhones.map(p => String(p).trim()).filter(Boolean)
        : [String(supportPhones).trim()].filter(Boolean);
      if (filtered.length > 0) {
        settings.supportPhones = filtered;
        settings.supportPhone = filtered[0];
      }
    } else if (supportPhone !== undefined) {
      settings.supportPhone = supportPhone;
      settings.supportPhones = [supportPhone];
    }

    settings.supportAddress = '';
    settings.whatsappLink = whatsappLink !== undefined ? whatsappLink : settings.whatsappLink;
    settings.taxPercent = 0;
    settings.serviceFeePercent = serviceFeePercent !== undefined ? parseFloat(serviceFeePercent) : settings.serviceFeePercent;
    settings.bookingWindowMonths = bookingWindowMonths !== undefined ? parseInt(bookingWindowMonths) : (settings.bookingWindowMonths || 3);
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
