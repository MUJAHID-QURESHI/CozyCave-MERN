const cloudinary = require('cloudinary').v2;

const isConfigured = !!(
  process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_CLOUD_NAME !== 'yourcloudname' &&
  process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_KEY !== 'yourapikey' &&
  process.env.CLOUDINARY_API_SECRET && process.env.CLOUDINARY_API_SECRET !== 'yourapisecret'
);

if (isConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
} else {
  console.warn('WARNING: Cloudinary credentials not fully set in .env. Mock image uploads will be used.');
}

module.exports = {
  cloudinary,
  isConfigured,
};
