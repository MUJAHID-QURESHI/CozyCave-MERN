export const mockDestinations = [
  { id: '1', name: 'Vijay Nagar, Indore', stays: 42 },
  { id: '2', name: 'Palasia, Indore', stays: 28 },
  { id: '3', name: 'Saket, Indore', stays: 18 },
  { id: '4', name: 'Rajwada, Indore', stays: 12 }
];

export const mockAmenities = [
  { id: 'wifi', name: 'Wi-Fi' },
  { id: 'ac', name: 'Air conditioning' },
  { id: 'kitchen', name: 'Kitchen' },
  { id: 'parking', name: 'Free parking' },
  { id: 'tv', name: 'Smart TV' },
  { id: 'washer', name: 'Washer / dryer' },
  { id: 'fireplace', name: 'Fireplace' },
  { id: 'hottub', name: 'Hot tub' },
  { id: 'pool', name: 'Swimming Pool' },
  { id: 'grill', name: 'BBQ Grill' },
  { id: 'beach', name: 'Ocean view' }
];

export const mockProperties = [
  {
    id: 'prop-1',
    name: 'Whispering Pines Cabin',
    description: 'A cozy timber cabin nestled deep within Indore. Features a beautiful stone fireplace, custom wood finishes, a private wrap-around porch, and an outdoor hot tub perfect for starry nights. Ideal for nature lovers or anyone wanting a luxurious forest retreat.',
    address: '284 Whispering Pines Trail, Vijay Nagar',
    city: 'Indore',
    state: 'Madhya Pradesh',
    country: 'India',
    rating: 4.97,
    reviewsCount: 184,
    price: 248,
    capacity: 4,
    bedrooms: 2,
    beds: 2,
    bathrooms: 2,
    amenities: ['Wi-Fi', 'Air conditioning', 'Kitchen', 'Free parking', 'Smart TV', 'Fireplace', 'Hot tub', 'BBQ Grill'],
    images: [
      'https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1449034446853-66c86144b0ad?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1200&q=80'
    ],
    tag: 'Superhost',
    hostName: 'Sarah & Dan',
    isActive: true,
    houseRules: [
      'Check-in: After 3:00 PM',
      'Checkout: 11:00 AM',
      'No smoking inside the cabin',
      'No parties or large gatherings',
      'Pets allowed with prior approval'
    ],
    checkInTime: '03:00 PM',
    checkOutTime: '11:00 AM',
    cancellationPolicy: 'Free cancellation for 48 hours. Cancel up to 7 days before check-in for a full refund minus service fees.',
    blockedDates: ['2026-08-20', '2026-08-21', '2026-08-22']
  },
  {
    id: 'prop-2',
    name: 'The Lakeside Villa',
    description: 'A stunning modern estate positioned directly on the scenic lakes of Indore. Boasts floor-to-ceiling glass walls with panoramic water views, an expansive private deck with a fire pit, a state-of-the-art chef\'s kitchen, and private boating access. Experience true high-end lakeside luxury.',
    address: '742 Emerald Bay Road, Bicholi Mardana',
    city: 'Indore',
    state: 'Madhya Pradesh',
    country: 'India',
    rating: 4.89,
    reviewsCount: 92,
    price: 412,
    capacity: 8,
    bedrooms: 4,
    beds: 5,
    bathrooms: 3.5,
    amenities: ['Wi-Fi', 'Air conditioning', 'Kitchen', 'Free parking', 'Smart TV', 'Washer / dryer', 'Swimming Pool', 'Fireplace', 'BBQ Grill'],
    images: [
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'
    ],
    tag: 'New',
    hostName: 'Richard Harrison',
    isActive: true,
    houseRules: [
      'Check-in: After 4:00 PM',
      'Checkout: 10:00 AM',
      'No pets allowed due to local wildlife',
      'Quiet hours begin at 10:00 PM',
      'No street parking (all cars must use driveway/garage)'
    ],
    checkInTime: '04:00 PM',
    checkOutTime: '10:00 AM',
    cancellationPolicy: 'Moderate cancellation policy. Cancel up to 14 days before check-in for a full refund.',
    blockedDates: ['2026-08-28', '2026-08-29']
  },
  {
    id: 'prop-3',
    name: 'Driftwood Garden House',
    description: 'Enjoy the peace from this beautiful garden cottage in Indore. Surrounded by lush greenery, this property features bright coastal decor, private lawns, a screened porch, a charcoal grill, and an outdoor shower. Perfect for families looking for the ultimate relaxing holiday.',
    address: '102 Dune Rider Way, Saket Colony',
    city: 'Indore',
    state: 'Madhya Pradesh',
    country: 'India',
    rating: 4.94,
    reviewsCount: 147,
    price: 365,
    capacity: 6,
    bedrooms: 3,
    beds: 4,
    bathrooms: 2,
    amenities: ['Wi-Fi', 'Air conditioning', 'Kitchen', 'Free parking', 'Smart TV', 'Washer / dryer', 'BBQ Grill', 'Ocean view'],
    images: [
      'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1548625361-155deee223d0?auto=format&fit=crop&w=1200&q=80'
    ],
    tag: 'Popular',
    hostName: 'Captain Robert',
    isActive: true,
    houseRules: [
      'Check-in: After 3:00 PM',
      'Checkout: 11:00 AM',
      'Wash sand off at outdoor shower before entering',
      'No loud music on the decks after 11:00 PM',
      'Trash must be put in bins by the road on Tuesday nights'
    ],
    checkInTime: '03:00 PM',
    checkOutTime: '11:00 AM',
    cancellationPolicy: 'Strict cancellation policy. Cancel up to 30 days before check-in for a 50% refund.',
    blockedDates: ['2026-09-01', '2026-09-02']
  },
  {
    id: 'prop-4',
    name: 'Serene Meadow Farmhouse',
    description: 'A beautifully restored historical farmhouse surrounded by blooming fields and gardens in Indore. Enjoy fresh herbs from the kitchen garden, breakfast under the gazebo, and lazy afternoons in the hammock. Includes modern air conditioning, premium mattresses, and local sightseeing tours.',
    address: '158 Meadow Road, Super Corridor',
    city: 'Indore',
    state: 'Madhya Pradesh',
    country: 'India',
    rating: 4.91,
    reviewsCount: 74,
    price: 295,
    capacity: 6,
    bedrooms: 3,
    beds: 3,
    bathrooms: 2.5,
    amenities: ['Wi-Fi', 'Air conditioning', 'Kitchen', 'Free parking', 'Smart TV', 'Washer / dryer', 'Fireplace'],
    images: [
      'https://images.unsplash.com/photo-1502005229762-fc1b2b812ca5?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=80'
    ],
    tag: 'Popular',
    hostName: 'Evelyn Taylor',
    isActive: true,
    houseRules: [
      'Check-in: After 2:00 PM',
      'Checkout: 11:00 AM',
      'Do not pick grapes from commercial vineyard rows',
      'Keep gates closed to protect livestock',
      'Enjoy complimentary bottle of estate wine responsibly!'
    ],
    checkInTime: '02:00 PM',
    checkOutTime: '11:00 AM',
    cancellationPolicy: 'Flexible. Full refund if cancelled 24 hours prior to check-in.',
    blockedDates: []
  },
  {
    id: 'prop-5',
    name: 'Redwood Glass Treehouse',
    description: 'An architectural marvel suspended high in the beautiful green canopy of Indore. Featuring massive glass walls, a copper soaking tub on the cantilevered deck, and high-speed satellite Wi-Fi. It is the ultimate digital detox or romantic escape.',
    address: '89 Canopy Heights Road, Palasia',
    city: 'Indore',
    state: 'Madhya Pradesh',
    country: 'India',
    rating: 4.98,
    reviewsCount: 310,
    price: 320,
    capacity: 2,
    bedrooms: 1,
    beds: 1,
    bathrooms: 1,
    amenities: ['Wi-Fi', 'Kitchen', 'Free parking', 'Hot tub', 'Fireplace', 'BBQ Grill'],
    images: [
      'https://images.unsplash.com/photo-1542718610-a1d656d1884c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1508193638397-1c4234db14d8?auto=format&fit=crop&w=1200&q=80'
    ],
    tag: 'Superhost',
    hostName: 'Marc & Julia',
    isActive: true,
    houseRules: [
      'Check-in: After 3:00 PM',
      'Checkout: 12:00 PM',
      'Adults only (not suitable for children)',
      'Strictly no fire pits or open flame due to wildfire risk',
      'Quiet forest hours must be respected'
    ],
    checkInTime: '03:00 PM',
    checkOutTime: '12:00 PM',
    cancellationPolicy: 'Super strict cancellation policy. Non-refundable.',
    blockedDates: []
  }
];

export const mockReviews = [
  {
    id: 'rev-1',
    propertyId: 'prop-1',
    userName: 'Emma Morrison',
    userAvatar: 'EM',
    rating: 5,
    date: 'July 2026',
    text: 'The cabin felt like it was designed just for us. Every detail, from the linens to the fireplace, made the trip feel effortless. Highly recommend the hot tub at night!'
  },
  {
    id: 'rev-2',
    propertyId: 'prop-2',
    userName: 'James Delgado',
    userAvatar: 'JD',
    rating: 5,
    date: 'June 2026',
    text: 'Booking took two minutes and the villa was even better than the photos. We loved having coffee on the dock in the mornings. We\'ll be back every summer from now on.'
  },
  {
    id: 'rev-3',
    propertyId: 'prop-3',
    userName: 'Sofia Petrova',
    userAvatar: 'SP',
    rating: 5,
    date: 'August 2026',
    text: 'CozyCave finds properties with real character. Our beach house had the warmest, most thoughtful touches throughout. Literally steps from the water. Perfect vacation.'
  },
  {
    id: 'rev-4',
    propertyId: 'prop-1',
    userName: 'Alex Mercer',
    userAvatar: 'AM',
    rating: 4.8,
    date: 'May 2026',
    text: 'Absolutely lovely cabin. Sarah was highly responsive. The location is incredibly peaceful, yet close enough to Asheville to explore the local microbreweries.'
  },
  {
    id: 'rev-5',
    propertyId: 'prop-4',
    userName: 'Chloe Vartanian',
    userAvatar: 'CV',
    rating: 4.9,
    date: 'July 2026',
    text: 'Breathtakingly beautiful meadows. Waking up and walking through the vineyard with our morning coffee was magical. The farmhouse is so beautifully decorated!'
  }
];

export const mockUsers = [
  {
    id: 'usr-1',
    name: 'Emma Morrison',
    email: 'emma@example.com',
    mobile: '+1 (828) 555-4921',
    role: 'customer',
    avatar: 'EM',
    joinedDate: 'January 2025'
  },
  {
    id: 'usr-admin',
    name: 'Admin CozyCave',
    email: 'admin@cozycave.com',
    mobile: '+1 (800) 555-COZY',
    role: 'admin',
    avatar: 'AD',
    joinedDate: 'December 2024'
  }
];

export const mockBookings = [
  {
    id: 'CC-8942-A',
    propertyId: 'prop-1',
    propertyName: 'Whispering Pines Cabin',
    propertyImage: 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=400&q=80',
    propertyLocation: 'Indore, Madhya Pradesh',
    userId: 'usr-1',
    userName: 'Emma Morrison',
    userEmail: 'emma@example.com',
    userMobile: '+1 (828) 555-4921',
    checkIn: '2026-09-12',
    checkOut: '2026-09-15',
    guests: {
      adults: 2,
      children: 1
    },
    nights: 3,
    pricePerNight: 248,
    cleaningFee: 75,
    serviceFee: 45,
    taxes: 67,
    totalAmount: 931,
    paymentStatus: 'Paid',
    status: 'Confirmed',
    createdAt: '2026-08-10'
  },
  {
    id: 'CC-7182-B',
    propertyId: 'prop-3',
    propertyName: 'Driftwood Garden House',
    propertyImage: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=400&q=80',
    propertyLocation: 'Indore, Madhya Pradesh',
    userId: 'usr-1',
    userName: 'Emma Morrison',
    userEmail: 'emma@example.com',
    userMobile: '+1 (828) 555-4921',
    checkIn: '2026-07-05',
    checkOut: '2026-07-10',
    guests: {
      adults: 4,
      children: 2
    },
    nights: 5,
    pricePerNight: 365,
    cleaningFee: 120,
    serviceFee: 95,
    taxes: 154,
    totalAmount: 2194,
    paymentStatus: 'Paid',
    status: 'Completed',
    createdAt: '2026-06-15'
  },
  {
    id: 'CC-3321-C',
    propertyId: 'prop-2',
    propertyName: 'The Lakeside Villa',
    propertyImage: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=400&q=80',
    propertyLocation: 'Indore, Madhya Pradesh',
    userId: 'usr-1',
    userName: 'Emma Morrison',
    userEmail: 'emma@example.com',
    userMobile: '+1 (828) 555-4921',
    checkIn: '2026-10-20',
    checkOut: '2026-10-24',
    guests: {
      adults: 2,
      children: 0
    },
    nights: 4,
    pricePerNight: 412,
    cleaningFee: 150,
    serviceFee: 110,
    taxes: 145,
    totalAmount: 2053,
    paymentStatus: 'Pending',
    status: 'Pending',
    createdAt: '2026-08-15'
  }
];

export const mockRevenueStats = {
  totalRevenue: 34290,
  monthlyRevenue: [
    { month: 'Jan', revenue: 2400 },
    { month: 'Feb', revenue: 3100 },
    { month: 'Mar', revenue: 4200 },
    { month: 'Apr', revenue: 3900 },
    { month: 'May', revenue: 5800 },
    { month: 'Jun', revenue: 6900 },
    { month: 'Jul', revenue: 8200 },
    { month: 'Aug', revenue: 7890 }
  ],
  propertyRevenue: [
    { name: 'Pines Cabin', revenue: 10420 },
    { name: 'Lakeside Villa', revenue: 12150 },
    { name: 'Beach House', revenue: 9540 },
    { name: 'Farmhouse', revenue: 2180 }
  ]
};
