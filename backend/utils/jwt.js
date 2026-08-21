const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'cozycavesupersecretjwtkey123456', {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

module.exports = { generateToken };
