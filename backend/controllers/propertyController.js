const Property = require('../models/Property');
const { calculatePrice } = require('../services/pricingService');

// Helper to generate a slug from a name
const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start
    .replace(/-+$/, ''); // Trim - from end
};

// @desc    Get all properties (with search & filters)
// @route   GET /api/properties
// @access  Public
const getProperties = async (req, res, next) => {
  try {
    const { location, guests, minPrice, maxPrice, amenities, sort } = req.query;

    const query = {};

    // Filter by active properties only
    query.isActive = true;

    // Filter by location (Indore by default if search is restricted)
    if (location) {
      query.$or = [
        { 'location.city': { $regex: location, $options: 'i' } },
        { 'location.state': { $regex: location, $options: 'i' } },
        { 'location.address': { $regex: location, $options: 'i' } },
        { name: { $regex: location, $options: 'i' } },
      ];
    }

    // Filter by guests capacity
    if (guests) {
      query.maxGuests = { $gte: parseInt(guests) };
    }

    // Filter by price range
    if (minPrice || maxPrice) {
      query.pricePerNight = {};
      if (minPrice) query.pricePerNight.$gte = parseFloat(minPrice);
      if (maxPrice) query.pricePerNight.$lte = parseFloat(maxPrice);
    }

    // Filter by amenities (comma-separated list)
    if (amenities) {
      const amenitiesList = amenities.split(',').map(a => a.trim());
      query.amenities = { $all: amenitiesList };
    }

    // Sorting
    let sortOption = {};
    if (sort === 'priceLow' || sort === 'price-asc') {
      sortOption = { pricePerNight: 1 };
    } else if (sort === 'priceHigh' || sort === 'price-desc') {
      sortOption = { pricePerNight: -1 };
    } else if (sort === 'rating' || sort === 'rating-desc') {
      sortOption = { rating: -1 };
    } else {
      sortOption = { rating: -1 };
    }

    const properties = await Property.find(query).sort(sortOption);

    res.status(200).json({
      success: true,
      message: 'Properties fetched successfully',
      data: properties,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single property details
// @route   GET /api/properties/:id
// @access  Public
const getPropertyById = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      res.status(404);
      throw new Error('Property not found');
    }

    res.status(200).json({
      success: true,
      message: 'Property details fetched successfully',
      data: property,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new property
// @route   POST /api/properties
// @access  Private/Admin
const createProperty = async (req, res, next) => {
  try {
    const {
      name, description, images, location, pricePerNight, maxGuests,
      bedrooms, beds, bathrooms, amenities, houseRules, checkInTime,
      checkOutTime, cancellationPolicy, tag
    } = req.body;

    if (!name || !description || !location || !pricePerNight || !maxGuests) {
      res.status(400);
      throw new Error('Please fill in all required fields');
    }

    const slug = slugify(name);
    const slugExists = await Property.findOne({ slug });
    const finalSlug = slugExists ? `${slug}-${Date.now().toString().slice(-4)}` : slug;

    const property = await Property.create({
      name,
      slug: finalSlug,
      description,
      images: images || [],
      location,
      pricePerNight,
      maxGuests,
      bedrooms: bedrooms || 1,
      beds: beds || 1,
      bathrooms: bathrooms || 1,
      amenities: amenities || [],
      houseRules: houseRules || [],
      checkInTime: checkInTime || '03:00 PM',
      checkOutTime: checkOutTime || '11:00 AM',
      cancellationPolicy: cancellationPolicy || 'Flexible cancellation.',
      tag: tag || 'New',
      createdBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: 'Property created successfully',
      data: property,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update an existing property
// @route   PUT /api/properties/:id
// @access  Private/Admin
const updateProperty = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      res.status(404);
      throw new Error('Property not found');
    }

    if (req.body.name) {
      property.name = req.body.name;
      property.slug = slugify(req.body.name);
    }
    property.description = req.body.description || property.description;
    property.images = req.body.images || property.images;
    property.location = req.body.location ? { ...property.location, ...req.body.location } : property.location;
    property.pricePerNight = req.body.pricePerNight !== undefined ? req.body.pricePerNight : property.pricePerNight;
    property.maxGuests = req.body.maxGuests !== undefined ? req.body.maxGuests : property.maxGuests;
    property.bedrooms = req.body.bedrooms !== undefined ? req.body.bedrooms : property.bedrooms;
    property.beds = req.body.beds !== undefined ? req.body.beds : property.beds;
    property.bathrooms = req.body.bathrooms !== undefined ? req.body.bathrooms : property.bathrooms;
    property.amenities = req.body.amenities || property.amenities;
    property.houseRules = req.body.houseRules || property.houseRules;
    property.checkInTime = req.body.checkInTime || property.checkInTime;
    property.checkOutTime = req.body.checkOutTime || property.checkOutTime;
    property.cancellationPolicy = req.body.cancellationPolicy || property.cancellationPolicy;
    property.tag = req.body.tag || property.tag;
    property.isActive = req.body.isActive !== undefined ? req.body.isActive : property.isActive;

    const updatedProperty = await property.save();

    res.status(200).json({
      success: true,
      message: 'Property updated successfully',
      data: updatedProperty,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a property
// @route   DELETE /api/properties/:id
// @access  Private/Admin
const deleteProperty = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      res.status(404);
      throw new Error('Property not found');
    }

    await Property.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Property deleted successfully',
      data: { id: req.params.id },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle property active status
// @route   PATCH /api/properties/:id/status
// @access  Private/Admin
const togglePropertyStatus = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      res.status(404);
      throw new Error('Property not found');
    }

    property.isActive = !property.isActive;
    await property.save();

    res.status(200).json({
      success: true,
      message: `Property status changed to ${property.isActive ? 'Active' : 'Inactive'}`,
      data: property,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Calculate and return property pricing breakdown for selected dates
// @route   GET /api/properties/:id/pricing
// @access  Public
const getPropertyPricingBreakdown = async (req, res, next) => {
  try {
    const { checkIn, checkOut } = req.query;
    const property = await Property.findById(req.params.id);

    if (!property) {
      res.status(404);
      throw new Error('Property not found');
    }

    if (!checkIn || !checkOut) {
      res.status(400);
      throw new Error('Please provide checkIn and checkOut dates');
    }

    const pricing = await calculatePrice(checkIn, checkOut, property);

    res.status(200).json({
      success: true,
      data: pricing,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
  togglePropertyStatus,
  getPropertyPricingBreakdown,
};
