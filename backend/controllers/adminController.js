const mongoose = require('mongoose');
const Booking = require('../models/Booking');
const User = require('../models/User');
const Property = require('../models/Property');
const Review = require('../models/Review');
const Availability = require('../models/Availability');
const { getDatesInRange } = require('../services/availabilityService');

const findBookingByIdOrRef = async (id) => {
  if (mongoose.Types.ObjectId.isValid(id)) {
    const b = await Booking.findById(id);
    if (b) return b;
  }
  return await Booking.findOne({ bookingId: id });
};

// @desc    Get all bookings (Admin only)
// @route   GET /api/admin/bookings
// @access  Private/Admin
const getAllBookings = async (req, res, next) => {
  try {
    const { status, paymentStatus } = req.query;
    const query = {};

    if (status) query.bookingStatus = status;
    if (paymentStatus) query.paymentStatus = paymentStatus;

    const bookings = await Booking.find(query)
      .populate('property', 'name location pricePerNight images')
      .populate('customer', 'name email mobile')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: 'All bookings fetched successfully',
      data: bookings,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single booking details (Admin only)
// @route   GET /api/admin/bookings/:id
// @access  Private/Admin
const getAdminBookingById = async (req, res, next) => {
  try {
    let bookingQuery = mongoose.Types.ObjectId.isValid(req.params.id)
      ? Booking.findById(req.params.id)
      : Booking.findOne({ bookingId: req.params.id });

    const booking = await bookingQuery
      .populate('property')
      .populate('customer', 'name email mobile profileImage');

    if (!booking) {
      res.status(404);
      throw new Error('Booking not found');
    }

    res.status(200).json({
      success: true,
      message: 'Booking details fetched successfully',
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update booking / payment status (Admin only)
// @route   PATCH /api/admin/bookings/:id/status
// @access  Private/Admin
const updateBookingStatus = async (req, res, next) => {
  try {
    const { bookingStatus, paymentStatus, cancellationReason } = req.body;
    const booking = await findBookingByIdOrRef(req.params.id);

    if (!booking) {
      res.status(404);
      throw new Error('Booking not found');
    }

    const prevStatus = booking.bookingStatus;

    if (bookingStatus) {
      booking.bookingStatus = bookingStatus;
      if (bookingStatus === 'cancelled') {
        booking.cancellationReason = cancellationReason || 'Cancelled by administrator';
      }
    }
    if (paymentStatus) {
      booking.paymentStatus = paymentStatus;
    }

    await booking.save();

    // Handle Availability dates status if booking status was updated
    if (bookingStatus && bookingStatus !== prevStatus) {
      const dates = getDatesInRange(booking.checkIn, booking.checkOut);
      if (bookingStatus === 'confirmed') {
        // Lock dates
        const bulkOps = dates.map(date => ({
          updateOne: {
            filter: { property: booking.property, date: date },
            update: { $set: { status: 'booked', booking: booking._id } },
            upsert: true,
          }
        }));
        await Availability.bulkWrite(bulkOps);
      } else if (bookingStatus === 'cancelled') {
        // Free dates
        await Availability.deleteMany({
          property: booking.property,
          date: { $in: dates },
          status: 'booked',
          $or: [
            { booking: booking._id },
            { booking: String(booking._id) },
            { booking: { $exists: false } },
            { booking: null }
          ]
        });
      }
    }

    res.status(200).json({
      success: true,
      message: 'Booking status updated successfully',
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all customers directory (Admin only)
// @route   GET /api/admin/customers
// @access  Private/Admin
const getCustomersDirectory = async (req, res, next) => {
  try {
    const customers = await User.find({ role: 'customer' }).select('-password');
    
    // Enrich with summary data
    const enrichedCustomers = await Promise.all(
      customers.map(async (customer) => {
        const bookings = await Booking.find({ customer: customer._id });
        const completedBookings = bookings.filter(b => b.bookingStatus === 'completed').length;
        const totalSpend = bookings
          .filter(b => b.paymentStatus === 'paid')
          .reduce((sum, b) => sum + b.totalAmount, 0);

        return {
          id: customer._id,
          name: customer.name,
          email: customer.email,
          mobile: customer.mobile,
          profileImage: customer.profileImage,
          createdAt: customer.createdAt,
          totalBookings: bookings.length,
          completedBookings,
          totalSpend,
        };
      })
    );

    res.status(200).json({
      success: true,
      message: 'Customer directory fetched successfully',
      data: enrichedCustomers,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get customer details with stays list (Admin only)
// @route   GET /api/admin/customers/:id
// @access  Private/Admin
const getCustomerDetails = async (req, res, next) => {
  try {
    const customer = await User.findOne({ _id: req.params.id, role: 'customer' }).select('-password');
    if (!customer) {
      res.status(404);
      throw new Error('Customer not found');
    }

    const bookings = await Booking.find({ customer: customer._id })
      .populate('property', 'name location pricePerNight images')
      .sort({ createdAt: -1 });

    const totalSpend = bookings
      .filter(b => b.paymentStatus === 'paid')
      .reduce((sum, b) => sum + b.totalAmount, 0);

    res.status(200).json({
      success: true,
      message: 'Customer details fetched successfully',
      data: {
        customer: {
          id: customer._id,
          name: customer.name,
          email: customer.email,
          mobile: customer.mobile,
          profileImage: customer.profileImage,
          joinedDate: customer.createdAt,
          totalSpend,
          bookingsCount: bookings.length,
        },
        bookings,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Admin Dashboard reports (Admin only)
// @route   GET /api/admin/dashboard
// @access  Private/Admin
const getDashboardStats = async (req, res, next) => {
  try {
    const totalProperties = await Property.countDocuments();
    const activePropertiesCount = await Property.countDocuments({ isActive: true });
    const totalBookings = await Booking.countDocuments();
    const totalCustomers = await User.countDocuments({ role: 'customer' });
    const pendingBookings = await Booking.countDocuments({ bookingStatus: 'pending' });

    const todayStr = new Date().toISOString().split('T')[0];
    const today = new Date(todayStr);

    const todayCheckIns = await Booking.countDocuments({
      checkIn: today,
      bookingStatus: { $in: ['confirmed', 'completed'] },
    });

    const todayCheckOuts = await Booking.countDocuments({
      checkOut: today,
      bookingStatus: { $in: ['confirmed', 'completed'] },
    });

    // Monthly revenue (paid bookings)
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const paidBookingsThisMonth = await Booking.find({
      paymentStatus: 'paid',
      createdAt: { $gte: startOfMonth },
    });
    const monthlyRevenue = paidBookingsThisMonth.reduce((sum, b) => sum + b.totalAmount, 0);

    // Occupancy calculation
    const bookedDatesToday = await Availability.countDocuments({
      date: todayStr,
      status: 'booked',
    });
    const occupancy = activePropertiesCount > 0 
      ? Math.round((bookedDatesToday / activePropertiesCount) * 100) 
      : 0;

    // Recent Bookings (limit 5)
    const recentBookings = await Booking.find()
      .populate('property', 'name')
      .populate('customer', 'name email')
      .sort({ createdAt: -1 })
      .limit(5);

    // Upcoming Check-ins (limit 5)
    const upcomingCheckIns = await Booking.find({
      checkIn: { $gte: today },
      bookingStatus: 'confirmed',
    })
      .populate('property', 'name')
      .populate('customer', 'name email')
      .sort({ checkIn: 1 })
      .limit(5);

    res.status(200).json({
      success: true,
      message: 'Dashboard stats fetched successfully',
      data: {
        totalProperties,
        totalBookings,
        totalCustomers,
        todayCheckIns,
        todayCheckOuts,
        pendingBookings,
        monthlyRevenue,
        occupancy,
        recentBookings,
        upcomingCheckIns,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Revenue Reports (Admin only)
// @route   GET /api/admin/revenue
// @access  Private/Admin
const getRevenueReport = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    const dateQuery = { paymentStatus: 'paid' };

    if (startDate || endDate) {
      dateQuery.createdAt = {};
      if (startDate) dateQuery.createdAt.$gte = new Date(startDate);
      if (endDate) dateQuery.createdAt.$lte = new Date(endDate);
    }

    const paidBookings = await Booking.find(dateQuery).populate('property', 'name');
    const totalRevenue = paidBookings.reduce((sum, b) => sum + b.totalAmount, 0);

    // Calculate distributions
    const propertyRevenueMap = {};
    paidBookings.forEach((b) => {
      if (b.property) {
        const name = b.property.name;
        propertyRevenueMap[name] = (propertyRevenueMap[name] || 0) + b.totalAmount;
      }
    });

    const propertyRevenue = Object.keys(propertyRevenueMap).map(name => ({
      name,
      revenue: propertyRevenueMap[name],
    }));

    res.status(200).json({
      success: true,
      message: 'Revenue report fetched successfully',
      data: {
        totalRevenue,
        bookingsCount: paidBookings.length,
        propertyRevenue,
        bookings: paidBookings.map(b => ({
          bookingId: b.bookingId,
          propertyName: b.property ? b.property.name : 'Unknown Property',
          amount: b.totalAmount,
          date: b.createdAt,
        })),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a booking (Admin only)
// @route   DELETE /api/admin/bookings/:id
// @access  Private/Admin
const deleteBooking = async (req, res, next) => {
  try {
    const booking = await findBookingByIdOrRef(req.params.id);
    if (!booking) {
      res.status(404);
      throw new Error('Booking not found');
    }

    if (booking.bookingStatus === 'confirmed' || booking.bookingStatus === 'completed') {
      const dates = getDatesInRange(booking.checkIn, booking.checkOut);
      await Availability.deleteMany({
        property: booking.property,
        date: { $in: dates },
        status: 'booked',
        booking: booking._id,
      });
    }

    await Booking.findByIdAndDelete(booking._id);

    res.status(200).json({
      success: true,
      message: 'Booking deleted successfully',
      data: { id: req.params.id },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllBookings,
  getAdminBookingById,
  updateBookingStatus,
  getCustomersDirectory,
  getCustomerDetails,
  getDashboardStats,
  getRevenueReport,
  deleteBooking,
};
