const Notification = require('../models/Notification');

const createNotification = async (userId, title, message, type = 'general') => {
  try {
    return await Notification.create({
      user: userId,
      title,
      message,
      type,
    });
  } catch (error) {
    console.error('Error creating notification:', error.message);
  }
};

module.exports = {
  createNotification,
};
