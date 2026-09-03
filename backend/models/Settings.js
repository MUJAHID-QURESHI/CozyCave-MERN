const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema(
  {
    portalName: { type: String, default: 'The Cozy Cave' },
    supportEmail: { type: String, default: 'hello@thecozycave.com' },
    supportPhone: { type: String, default: '+1 (828) 555-0173' },
    supportPhones: { 
      type: [String], 
      default: ['+1 (828) 555-0173', '+1 (828) 555-0174', '+1 (828) 555-0175'] 
    },
    supportAddress: { type: String, default: '' },
    whatsappLink: { type: String, default: 'https://wa.me/18285550173' },
    taxPercent: { type: Number, default: 0 },
    serviceFeePercent: { type: Number, default: 8 },
    maintenanceMode: { type: Boolean, default: false }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Settings', settingsSchema);
