const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const { cloudinary, isConfigured } = require('../config/cloudinary');

let storage;

if (isConfigured) {
  storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'cozycave_properties',
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    },
  });
} else {
  // Local fallback: use memory storage, then the controller can return a mock URL.
  storage = multer.memoryStorage();
}

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  },
});

module.exports = upload;
