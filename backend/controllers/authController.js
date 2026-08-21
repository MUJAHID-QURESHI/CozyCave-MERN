const User = require('../models/User');
const { generateToken } = require('../utils/jwt');
const { validateEmail, validatePassword, validateMobile } = require('../utils/validators');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res, next) => {
  try {
    const { name, email, mobile, password } = req.body;

    if (!name || !email || !mobile || !password) {
      res.status(400);
      throw new Error('Please enter all required fields');
    }

    if (!validateEmail(email)) {
      res.status(400);
      throw new Error('Please enter a valid email address');
    }

    if (!validatePassword(password)) {
      res.status(400);
      throw new Error('Password must be at least 6 characters long');
    }

    if (!validateMobile(mobile)) {
      res.status(400);
      throw new Error('Please enter a valid mobile number');
    }

    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      res.status(400);
      throw new Error('User already exists with this email');
    }

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      mobile,
      password,
    });

    if (user) {
      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: {
          token: generateToken(user._id),
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            mobile: user.mobile,
            role: user.role,
            profileImage: user.profileImage,
          },
        },
      });
    } else {
      res.status(400);
      throw new Error('Invalid user data received');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400);
      throw new Error('Please provide email and password');
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (user && (await user.comparePassword(password))) {
      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: {
          token: generateToken(user._id),
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            mobile: user.mobile,
            role: user.role,
            profileImage: user.profileImage,
          },
        },
      });
    } else {
      res.status(401);
      throw new Error('Invalid email or password');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      res.status(200).json({
        success: true,
        message: 'User profile fetched successfully',
        data: {
          id: user._id,
          name: user.name,
          email: user.email,
          mobile: user.mobile,
          role: user.role,
          profileImage: user.profileImage,
        },
      });
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.mobile = req.body.mobile || user.mobile;
      if (req.body.password) {
        user.password = req.body.password;
      }
      if (req.body.profileImage !== undefined) {
        user.profileImage = req.body.profileImage;
      }

      const updatedUser = await user.save();

      res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        data: {
          id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          mobile: updatedUser.mobile,
          role: updatedUser.role,
          profileImage: updatedUser.profileImage,
        },
      });
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
};
