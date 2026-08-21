const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Property = require('../models/Property');
const Booking = require('../models/Booking');
const Review = require('../models/Review');
const Availability = require('../models/Availability');
const Payment = require('../models/Payment');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/cozycave';
    console.log('Connecting to MongoDB at:', mongoUri);
    await mongoose.connect(mongoUri);

    console.log('Clearing database collections...');
    await User.deleteMany({});
    await Property.deleteMany({});
    await Booking.deleteMany({});
    await Review.deleteMany({});
    await Availability.deleteMany({});
    await Payment.deleteMany({});

    console.log('Creating users...');
    
    // Seed Admin
    const adminUser = await User.create({
      name: 'Admin CozyCave',
      email: 'admin@cozycave.com',
      mobile: '+1 (800) 555-2699',
      password: 'adminpassword123', // Will be hashed by userSchema pre-save
      role: 'admin',
      profileImage: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    });

    // Seed Customer 1 (Emma Morrison)
    const customer1 = await User.create({
      name: 'Emma Morrison',
      email: 'emma@example.com',
      mobile: '+1 (828) 555-4921',
      password: 'emmapassword123',
      role: 'customer',
      profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    });

    // Seed Customer 2 (John Doe)
    const customer2 = await User.create({
      name: 'John Doe',
      email: 'john@example.com',
      mobile: '+1 (555) 123-4567',
      password: 'johnpassword123',
      role: 'customer',
      profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    });

    console.log('Seeding properties...');

    const propertyData = [
      {
        _id: new mongoose.Types.ObjectId('65d21cb5e340fa189cbb6241'), // fixed ID matching prop-1
        name: 'Whispering Pines Cabin',
        slug: 'whispering-pines-cabin',
        description: 'A cozy timber cabin nestled deep within Indore. Features a beautiful stone fireplace, custom wood finishes, a private wrap-around porch, and an outdoor hot tub perfect for starry nights. Ideal for nature lovers or anyone wanting a luxurious forest retreat.',
        images: [
          'https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1449034446853-66c86144b0ad?auto=format&fit=crop&w=1200&q=80'
        ],
        location: {
          address: '284 Whispering Pines Trail, Vijay Nagar',
          city: 'Indore',
          state: 'Madhya Pradesh',
          country: 'India',
          pincode: '452010',
          latitude: 22.7533,
          longitude: 75.8937
        },
        pricePerNight: 248,
        maxGuests: 4,
        bedrooms: 2,
        beds: 2,
        bathrooms: 2,
        amenities: ['Wi-Fi', 'Air conditioning', 'Kitchen', 'Free parking', 'Smart TV', 'Fireplace', 'Hot tub', 'BBQ Grill'],
        houseRules: ['Check-in: After 3:00 PM', 'Checkout: 11:00 AM', 'No smoking inside'],
        checkInTime: '03:00 PM',
        checkOutTime: '11:00 AM',
        cancellationPolicy: 'Moderate cancellation policy.',
        rating: 4.95,
        reviewCount: 2,
        isActive: true,
        createdBy: adminUser._id
      },
      {
        _id: new mongoose.Types.ObjectId('65d21cb5e340fa189cbb6242'), // fixed ID matching prop-2
        name: 'The Lakeside Villa',
        slug: 'the-lakeside-villa',
        description: 'A stunning modern estate positioned directly on the scenic lakes of Indore. Boasts floor-to-ceiling glass walls with panoramic water views, an expansive private deck with a fire pit, a state-of-the-art chef\'s kitchen, and private boating access. Experience true high-end lakeside luxury.',
        images: [
          'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80'
        ],
        location: {
          address: '742 Emerald Bay Road, Bicholi Mardana',
          city: 'Indore',
          state: 'Madhya Pradesh',
          country: 'India',
          pincode: '452016',
          latitude: 22.7122,
          longitude: 75.9189
        },
        pricePerNight: 412,
        maxGuests: 8,
        bedrooms: 4,
        beds: 5,
        bathrooms: 3.5,
        amenities: ['Wi-Fi', 'Air conditioning', 'Kitchen', 'Free parking', 'Smart TV', 'Washer / dryer', 'Swimming Pool', 'Fireplace'],
        houseRules: ['Check-in: After 4:00 PM', 'Checkout: 10:00 AM', 'No pets allowed'],
        checkInTime: '04:00 PM',
        checkOutTime: '10:00 AM',
        cancellationPolicy: 'Moderate cancellation policy.',
        rating: 4.89,
        reviewCount: 1,
        isActive: true,
        createdBy: adminUser._id
      },
      {
        _id: new mongoose.Types.ObjectId('65d21cb5e340fa189cbb6243'), // fixed ID matching prop-3
        name: 'Driftwood Garden House',
        slug: 'driftwood-garden-house',
        description: 'Enjoy the peace from this beautiful garden cottage in Indore. Surrounded by lush greenery, this property features bright coastal decor, private lawns, a screened porch, a charcoal grill, and an outdoor shower. Perfect for families looking for the ultimate relaxing holiday.',
        images: [
          'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=1200&q=80'
        ],
        location: {
          address: '102 Dune Rider Way, Saket Colony',
          city: 'Indore',
          state: 'Madhya Pradesh',
          country: 'India',
          pincode: '452018',
          latitude: 22.7244,
          longitude: 75.8839
        },
        pricePerNight: 365,
        maxGuests: 6,
        bedrooms: 3,
        beds: 4,
        bathrooms: 2,
        amenities: ['Wi-Fi', 'Air conditioning', 'Kitchen', 'Free parking', 'Smart TV', 'Ocean view'],
        houseRules: ['Check-in: After 3:00 PM', 'Checkout: 11:00 AM'],
        checkInTime: '03:00 PM',
        checkOutTime: '11:00 AM',
        cancellationPolicy: 'Strict cancellation policy.',
        rating: 4.94,
        reviewCount: 1,
        isActive: true,
        createdBy: adminUser._id
      },
      {
        _id: new mongoose.Types.ObjectId('65d21cb5e340fa189cbb6244'), // fixed ID matching prop-4
        name: 'Serene Meadow Farmhouse',
        slug: 'serene-meadow-farmhouse',
        description: 'A beautifully restored historical farmhouse surrounded by blooming fields and gardens in Indore. Enjoy fresh herbs from the kitchen garden, breakfast under the gazebo, and lazy afternoons in the hammock. Includes modern air conditioning, premium mattresses, and local sightseeing tours.',
        images: [
          'https://images.unsplash.com/photo-1502005229762-fc1b2b812ca5?auto=format&fit=crop&w=1200&q=80'
        ],
        location: {
          address: '158 Meadow Road, Super Corridor',
          city: 'Indore',
          state: 'Madhya Pradesh',
          country: 'India',
          pincode: '453555',
          latitude: 22.8021,
          longitude: 75.8239
        },
        pricePerNight: 295,
        maxGuests: 6,
        bedrooms: 3,
        beds: 3,
        bathrooms: 2.5,
        amenities: ['Wi-Fi', 'Air conditioning', 'Kitchen', 'Free parking', 'Smart TV', 'Washer / dryer', 'Fireplace'],
        houseRules: ['Check-in: After 2:00 PM', 'Checkout: 11:00 AM'],
        checkInTime: '02:00 PM',
        checkOutTime: '11:00 AM',
        cancellationPolicy: 'Flexible. Full refund if cancelled 24 hours prior.',
        rating: 4.9,
        reviewCount: 1,
        isActive: true,
        createdBy: adminUser._id
      },
      {
        _id: new mongoose.Types.ObjectId('65d21cb5e340fa189cbb6245'), // fixed ID matching prop-5
        name: 'Redwood Glass Treehouse',
        slug: 'redwood-glass-treehouse',
        description: 'An architectural marvel suspended high in the beautiful green canopy of Indore. Featuring massive glass walls, a copper soaking tub on the cantilevered deck, and high-speed satellite Wi-Fi. It is the ultimate digital detox or romantic escape.',
        images: [
          'https://images.unsplash.com/photo-1542718610-a1d656d1884c?auto=format&fit=crop&w=1200&q=80'
        ],
        location: {
          address: '89 Canopy Heights Road, Palasia',
          city: 'Indore',
          state: 'Madhya Pradesh',
          country: 'India',
          pincode: '452001',
          latitude: 22.7278,
          longitude: 75.8941
        },
        pricePerNight: 320,
        maxGuests: 2,
        bedrooms: 1,
        beds: 1,
        bathrooms: 1,
        amenities: ['Wi-Fi', 'Kitchen', 'Free parking', 'Hot tub', 'Fireplace', 'BBQ Grill'],
        houseRules: ['Check-in: After 3:00 PM', 'Checkout: 12:00 PM', 'Adults only'],
        checkInTime: '03:00 PM',
        checkOutTime: '12:00 PM',
        cancellationPolicy: 'Non-refundable.',
        rating: 4.98,
        reviewCount: 0,
        isActive: true,
        createdBy: adminUser._id
      }
    ];

    const properties = await Property.insertMany(propertyData);
    console.log('Seeded properties count:', properties.length);

    console.log('Seeding bookings and availability...');

    // Booking 1: Completed stay for Emma Morrison at Whispering Pines Cabin (allows her to leave review)
    const booking1 = await Booking.create({
      bookingId: 'CC-2026-894200',
      customer: customer1._id,
      property: properties[0]._id, // Pines Cabin
      checkIn: new Date('2026-07-05'),
      checkOut: new Date('2026-07-08'),
      guests: { adults: 2, children: 1 },
      numberOfNights: 3,
      pricePerNight: 248,
      subtotal: 744,
      cleaningFee: 75,
      serviceFee: 60,
      tax: 45,
      totalAmount: 924,
      paymentStatus: 'paid',
      bookingStatus: 'completed',
      guestDetails: {
        name: 'Emma Morrison',
        email: 'emma@example.com',
        mobile: '+1 (828) 555-4921'
      }
    });

    // Seed Availability dates for Booking 1
    const dates1 = ['2026-07-05', '2026-07-06', '2026-07-07'];
    await Promise.all(
      dates1.map(d => Availability.create({
        property: properties[0]._id,
        date: d,
        status: 'booked',
        booking: booking1._id
      }))
    );

    // Booking 2: Confirmed stay for Emma Morrison at Driftwood Garden House
    const booking2 = await Booking.create({
      bookingId: 'CC-2026-718200',
      customer: customer1._id,
      property: properties[2]._id, // Driftwood Garden House
      checkIn: new Date('2026-09-12'),
      checkOut: new Date('2026-09-17'),
      guests: { adults: 4, children: 2 },
      numberOfNights: 5,
      pricePerNight: 365,
      subtotal: 1825,
      cleaningFee: 75,
      serviceFee: 146,
      tax: 110,
      totalAmount: 2156,
      paymentStatus: 'paid',
      bookingStatus: 'confirmed',
      guestDetails: {
        name: 'Emma Morrison',
        email: 'emma@example.com',
        mobile: '+1 (828) 555-4921'
      }
    });

    // Seed Availability dates for Booking 2
    const dates2 = ['2026-09-12', '2026-09-13', '2026-09-14', '2026-09-15', '2026-09-16'];
    await Promise.all(
      dates2.map(d => Availability.create({
        property: properties[2]._id,
        date: d,
        status: 'booked',
        booking: booking2._id
      }))
    );

    // Booking 3: Pending stay for John Doe at Lakeside Villa
    const booking3 = await Booking.create({
      bookingId: 'CC-2026-332100',
      customer: customer2._id,
      property: properties[1]._id, // Lakeside Villa
      checkIn: new Date('2026-10-20'),
      checkOut: new Date('2026-10-24'),
      guests: { adults: 2, children: 0 },
      numberOfNights: 4,
      pricePerNight: 412,
      subtotal: 1648,
      cleaningFee: 75,
      serviceFee: 132,
      tax: 99,
      totalAmount: 1954,
      paymentStatus: 'pending',
      bookingStatus: 'pending',
      guestDetails: {
        name: 'John Doe',
        email: 'john@example.com',
        mobile: '+1 (555) 123-4567'
      }
    });

    console.log('Seeding reviews...');

    // Review 1: review for Whispering Pines Cabin (Booking 1)
    await Review.create({
      customer: customer1._id,
      property: properties[0]._id,
      booking: booking1._id,
      rating: 5,
      cleanliness: 5,
      location: 5,
      comfort: 5,
      service: 5,
      comment: 'Absolutely magical stay! The hot tub was pristine and Vijay Nagar was highly accessible. Sarah was an amazing host.'
    });

    // Review 2: review for Whispering Pines Cabin from John Doe (assuming past completed stay)
    const bookingDummy = await Booking.create({
      bookingId: 'CC-2026-111111',
      customer: customer2._id,
      property: properties[0]._id,
      checkIn: new Date('2026-06-01'),
      checkOut: new Date('2026-06-04'),
      guests: { adults: 2, children: 0 },
      numberOfNights: 3,
      pricePerNight: 248,
      subtotal: 744,
      cleaningFee: 75,
      serviceFee: 60,
      tax: 45,
      totalAmount: 924,
      paymentStatus: 'paid',
      bookingStatus: 'completed',
      guestDetails: {
        name: 'John Doe',
        email: 'john@example.com',
        mobile: '+1 (555) 123-4567'
      }
    });

    await Review.create({
      customer: customer2._id,
      property: properties[0]._id,
      booking: bookingDummy._id,
      rating: 4.9,
      cleanliness: 5,
      location: 4,
      comfort: 5,
      service: 5,
      comment: 'Very cozy timber cabin. Perfect weather in June. Enjoyed the outdoor hot tub under the stars.'
    });

    // Review 3: review for Lakeside Villa (by Emma Morrison, assuming past completed stay)
    const bookingDummy2 = await Booking.create({
      bookingId: 'CC-2026-222222',
      customer: customer1._id,
      property: properties[1]._id,
      checkIn: new Date('2026-06-15'),
      checkOut: new Date('2026-06-20'),
      guests: { adults: 4, children: 0 },
      numberOfNights: 5,
      pricePerNight: 412,
      subtotal: 2060,
      cleaningFee: 75,
      serviceFee: 165,
      tax: 124,
      totalAmount: 2424,
      paymentStatus: 'paid',
      bookingStatus: 'completed',
      guestDetails: {
        name: 'Emma Morrison',
        email: 'emma@example.com',
        mobile: '+1 (828) 555-4921'
      }
    });

    await Review.create({
      customer: customer1._id,
      property: properties[1]._id,
      booking: bookingDummy2._id,
      rating: 4.89,
      cleanliness: 5,
      location: 5,
      comfort: 4,
      service: 5,
      comment: 'The villa was even more spectacular than in the photos! Waking up to the lake views at Bicholi Mardana was unforgettable.'
    });

    console.log('Database Seeding Completed Successfully! 🌱');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error.message);
    process.exit(1);
  }
};

seedDatabase();
