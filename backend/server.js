const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// Load environment variables
dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Security Middlewares
app.use(helmet());

// CORS configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// JSON Parser
app.use(express.json());

// Rate Limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.',
  },
});
app.use('/api/', apiLimiter);

// Health Endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'CozyCave API is running',
  });
});

// Import Routes
const authRoutes = require('./routes/authRoutes');
const propertyRoutes = require('./routes/propertyRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const favoriteRoutes = require('./routes/favoriteRoutes');
const availabilityRoutes = require('./routes/availabilityRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const adminRoutes = require('./routes/adminRoutes');
const settingsRoutes = require('./routes/settingsRoutes');
// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/availability', availabilityRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/settings', settingsRoutes);

// File Upload endpoint
app.post(
  '/api/upload/property-images',
  require('./middleware/authMiddleware').protect,
  require('./middleware/adminMiddleware').admin,
  require('./middleware/uploadMiddleware').array('images', 5),
  (req, res) => {
    try {
      let imageUrls = [];
      if (req.files && req.files.length > 0) {
        if (require('./config/cloudinary').isConfigured) {
          imageUrls = req.files.map(file => file.path);
        } else {
          const mockPhotos = [
            'https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1508333706533-1ab43ecb1606?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1449034446853-66c86144b0ad?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=1200&q=80'
          ];
          imageUrls = req.files.map((file, idx) => 
            mockPhotos[idx % mockPhotos.length]
          );
        }
      }
      res.status(200).json({
        success: true,
        message: 'Images uploaded successfully',
        data: imageUrls,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
);

// Fallback Middlewares
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

module.exports = server;
