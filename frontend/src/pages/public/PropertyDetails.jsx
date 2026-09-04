import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Star, MapPin, Calendar, Users, Coffee, ShowerHead, Bed, Home, AlertCircle, ChevronDown, CheckCircle, ChevronLeft, ChevronRight, X, Maximize2
} from 'lucide-react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { fetchPropertyById } from '../../redux/slices/propertySlice';
import { setPendingBooking } from '../../redux/slices/bookingSlice';
import api from '../../services/api';
import { addToast } from '../../redux/slices/uiSlice';

export default function PropertyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { selectedProperty } = useSelector((state) => state.properties);
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { serviceFeePercent = 2, bookingWindowMonths = 3 } = useSelector((state) => state.settings);

  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [showGuestDropdown, setShowGuestDropdown] = useState(false);
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  // Fullscreen Lightbox state
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIdx, setLightboxIdx] = useState(0);

  const openLightbox = (idx) => {
    setLightboxIdx(idx);
    setIsLightboxOpen(true);
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
  };

  const handlePrevImage = (e) => {
    if (e) e.stopPropagation();
    const imgs = selectedProperty?.images || [];
    if (imgs.length === 0) return;
    setLightboxIdx((prev) => (prev === 0 ? imgs.length - 1 : prev - 1));
  };

  const handleNextImage = (e) => {
    if (e) e.stopPropagation();
    const imgs = selectedProperty?.images || [];
    if (imgs.length === 0) return;
    setLightboxIdx((prev) => (prev === imgs.length - 1 ? 0 : prev + 1));
  };

  // Keyboard navigation for Lightbox
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isLightboxOpen) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') handlePrevImage();
      if (e.key === 'ArrowRight') handleNextImage();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen, selectedProperty]);

  // New review submission form state
  const [reviewsList, setReviewsList] = useState([]);
  const [newReviewText, setNewReviewText] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);

  const [pricingBreakdown, setPricingBreakdown] = useState(null);
  const [loadingPricing, setLoadingPricing] = useState(false);

  // Custom Calendar State
  const [availabilityList, setAvailabilityList] = useState([]);
  const [loadingAvail, setLoadingAvail] = useState(false);
  const [calYear, setCalYear] = useState(new Date().getFullYear());
  const [calMonth, setCalMonth] = useState(new Date().getMonth());
  const [showCalendar, setShowCalendar] = useState(false);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June', 
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const calculateNights = () => {
    if (!checkIn || !checkOut) return 0;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diff = end.getTime() - start.getTime();
    return Math.max(0, Math.ceil(diff / (1000 * 3600 * 24)));
  };

  const nights = calculateNights();

  useEffect(() => {
    const fetchPricing = async () => {
      if (checkIn && checkOut && nights > 0) {
        setLoadingPricing(true);
        try {
          const res = await api.get(`/properties/${id}/pricing?checkIn=${checkIn}&checkOut=${checkOut}`);
          setPricingBreakdown(res.data.data);
        } catch (err) {
          console.error('Pricing calculation failed', err);
        } finally {
          setLoadingPricing(false);
        }
      } else {
        setPricingBreakdown(null);
      }
    };
    fetchPricing();
  }, [checkIn, checkOut, id, nights]);

  useEffect(() => {
    if (id) {
      dispatch(fetchPropertyById(id));
      api.get(`/reviews/property/${id}`)
        .then(res => {
          setReviewsList(res.data.data || []);
        })
        .catch(err => {
          console.error('Failed to load reviews:', err.message);
        });

      setLoadingAvail(true);
      api.get(`/availability/${id}`)
        .then(res => {
          setAvailabilityList(res.data.data || []);
        })
        .catch(err => {
          console.error('Failed to load availability:', err.message);
        })
        .finally(() => {
          setLoadingAvail(false);
        });
    }
  }, [id, dispatch]);

  if (!selectedProperty) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center py-20 px-4">
          <AlertCircle size={48} className="text-red-500 mb-4" />
          <h3 className="font-fraunces text-xl font-semibold text-forest-dark mb-2">Property not found</h3>
          <p className="text-charcoal-soft text-[14.5px] mb-6">The property you are looking for does not exist or has been removed.</p>
          <Link to="/properties" className="px-6 py-2.5 bg-forest text-white rounded-full font-semibold text-[13.5px]">
            Back to Properties
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const {
    name, description, address, city, state, rating, amenities, price,
    capacity, bedrooms, beds, bathrooms, images, tag, hostName,
    houseRules, checkInTime, checkOutTime, cancellationPolicy, blockedDates,
    location, googleMapUrl
  } = selectedProperty;

  const handleMapRedirect = () => {
    if (googleMapUrl) {
      window.open(googleMapUrl, '_blank', 'noopener,noreferrer');
    } else {
      const lat = location?.latitude || 22.7196;
      const lng = location?.longitude || 75.8577;
      const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  // Custom Calendar Helpers
  const getLocalTodayString = () => {
    const today = new Date();
    const y = today.getFullYear();
    const m = String(today.getMonth() + 1).padStart(2, '0');
    const d = String(today.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  // Compute maximum allowable advance booking date based on admin settings
  const todayObj = new Date();
  const allowedMonthsCount = Number(bookingWindowMonths) || 3;
  const maxBookingDateObj = new Date(todayObj.getFullYear(), todayObj.getMonth() + allowedMonthsCount, todayObj.getDate());
  const maxBookingDateStr = maxBookingDateObj.toISOString().split('T')[0];
  const currentMonthStart = new Date(todayObj.getFullYear(), todayObj.getMonth(), 1);
  const maxAllowedMonthStart = new Date(todayObj.getFullYear(), todayObj.getMonth() + allowedMonthsCount, 1);

  const getDaysInMonth = (y, m) => new Date(y, m + 1, 0).getDate();
  const getFirstDayOfMonth = (y, m) => new Date(y, m, 1).getDay();

  const calDaysInMonth = getDaysInMonth(calYear, calMonth);
  const calStartDayIdx = getFirstDayOfMonth(calYear, calMonth);

  const calDaysArray = [];
  for (let i = 0; i < calStartDayIdx; i++) {
    calDaysArray.push(null);
  }
  for (let i = 1; i <= calDaysInMonth; i++) {
    calDaysArray.push(i);
  }

  const getCalDateString = (day) => {
    if (!day) return '';
    const mStr = String(calMonth + 1).padStart(2, '0');
    const dStr = String(day).padStart(2, '0');
    return `${calYear}-${mStr}-${dStr}`;
  };

  const getCalDateStatus = (day) => {
    if (!day) return 'empty';
    const dateStr = getCalDateString(day);

    // 1. Past dates
    const todayStr = getLocalTodayString();
    if (dateStr < todayStr) return 'past';

    // 2. Beyond admin advance booking window limit
    if (dateStr > maxBookingDateStr) return 'beyond_window';

    // 3. Blocked or Booked from availability list
    const record = availabilityList.find(a => a.date === dateStr);
    if (record) {
      if (record.status === 'blocked') return 'blocked';
      if (record.status === 'booked') return 'booked';
    }

    // 4. Fallback check for property's own blockedDates array (if any)
    if (blockedDates && blockedDates.includes(dateStr)) {
      return 'blocked';
    }

    return 'available';
  };

  const getCalDatePrice = (day) => {
    if (!day) return '';
    const dateStr = getCalDateString(day);
    const record = availabilityList.find(a => a.date === dateStr);
    if (record && record.price) {
      return record.price;
    }
    return price;
  };

  const handleDateClick = (day) => {
    if (!day) return;
    const dateStr = getCalDateString(day);
    const status = getCalDateStatus(day);

    if (status === 'past' || status === 'beyond_window') {
      dispatch(addToast({ 
        message: status === 'past' 
          ? 'Cannot select past dates' 
          : `Reservations are open up to ${bookingWindowMonths || 3} months in advance`, 
        type: 'warning' 
      }));
      return;
    }
    if (status === 'blocked' || status === 'booked') {
      dispatch(addToast({ message: 'This date is already booked or blocked', type: 'warning' }));
      return;
    }

    if (!checkIn || (checkIn && checkOut)) {
      setCheckIn(dateStr);
      setCheckOut('');
    } else {
      if (dateStr <= checkIn) {
        setCheckIn(dateStr);
      } else {
        // Strict overlap check: ensure no date from checkIn to checkout date is blocked/booked
        let hasConflict = false;
        let tempDate = new Date(checkIn);
        const end = new Date(dateStr);
        while (tempDate < end) {
          const tempStr = tempDate.toISOString().split('T')[0];
          if (isDateBlocked(tempStr)) {
            hasConflict = true;
            break;
          }
          tempDate.setDate(tempDate.getDate() + 1);
        }

        if (hasConflict) {
          dispatch(addToast({ message: 'Selected date range overlaps with an existing reservation. Please pick another range.', type: 'error' }));
          return;
        } else {
          setCheckOut(dateStr);
          setShowCalendar(false);
        }
      }
    }
  };

  const isPrevCalDisabled = new Date(calYear, calMonth, 1) <= currentMonthStart;
  const isNextCalDisabled = new Date(calYear, calMonth + 1, 1) > maxAllowedMonthStart;

  const handlePrevCalMonth = () => {
    if (isPrevCalDisabled) return;
    if (calMonth === 0) {
      setCalMonth(11);
      setCalYear(calYear - 1);
    } else {
      setCalMonth(calMonth - 1);
    }
  };

  const handleNextCalMonth = () => {
    if (isNextCalDisabled) return;
    if (calMonth === 11) {
      setCalMonth(0);
      setCalYear(calYear + 1);
    } else {
      setCalMonth(calMonth + 1);
    }
  };

  // Date availability and price calculation helper
  const isDateBlocked = (dateStr) => {
    if (dateStr > maxBookingDateStr) return true;
    const record = availabilityList.find(a => a.date === dateStr);
    if (record && (record.status === 'blocked' || record.status === 'booked')) {
      return true;
    }
    if (blockedDates && blockedDates.includes(dateStr)) {
      return true;
    }
    return false;
  };

  // Dynamic fees based on booking nights
  const baseCost = pricingBreakdown ? pricingBreakdown.subtotal : (price * nights);
  const feePercent = (serviceFeePercent !== undefined && serviceFeePercent !== null) ? Number(serviceFeePercent) : 2;
  const serviceFee = pricingBreakdown 
    ? pricingBreakdown.serviceFee 
    : (nights > 0 ? Math.ceil((price * nights) * (feePercent / 100)) : 0);
  const taxes = 0;
  const totalAmount = pricingBreakdown ? pricingBreakdown.totalAmount : (baseCost + serviceFee);

  const handleBooking = (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      dispatch(addToast({ message: 'Please log in or register to book a property', type: 'warning' }));
      navigate('/login');
      return;
    }
    if (!checkIn || !checkOut) {
      dispatch(addToast({ message: 'Please select check-in and check-out dates', type: 'warning' }));
      return;
    }
    if (checkIn > maxBookingDateStr || checkOut > maxBookingDateStr) {
      dispatch(addToast({ 
        message: `Stays can only be booked up to ${bookingWindowMonths || 3} months in advance`, 
        type: 'warning' 
      }));
      return;
    }
    if (nights <= 0) {
      dispatch(addToast({ message: 'Check-out date must be after check-in date', type: 'warning' }));
      return;
    }

    // Check if dates are blocked or conflict with an existing reservation
    let dateConflict = false;
    let tempDate = new Date(checkIn);
    const end = new Date(checkOut);
    while (tempDate < end) {
      const dateStr = tempDate.toISOString().split('T')[0];
      if (isDateBlocked(dateStr)) {
        dateConflict = true;
        break;
      }
      tempDate.setDate(tempDate.getDate() + 1);
    }

    if (dateConflict) {
      dispatch(addToast({ message: 'Selected dates conflict with an existing reservation. Please pick other dates.', type: 'error' }));
      return;
    }

    const bookingPayload = {
      propertyId: id,
      propertyName: name,
      propertyImage: images && images.length > 0 ? images[0] : null,
      propertyLocation: `${city}, ${state}`,
      checkIn,
      checkOut,
      guests: { adults, children },
      nights,
      pricePerNight: pricingBreakdown ? pricingBreakdown.pricePerNight : price,
      subtotal: baseCost,
      cleaningFee: 0,
      serviceFee,
      taxes: 0,
      totalAmount
    };

    dispatch(setPendingBooking(bookingPayload));
    navigate('/checkout');
  };

  const handleAddReview = (e) => {
    e.preventDefault();
    if (!newReviewText.trim()) {
      dispatch(addToast({ message: 'Please enter a review message', type: 'warning' }));
      return;
    }

    api.post('/reviews', {
      propertyId: id,
      rating: parseFloat(newReviewRating),
      comment: newReviewText,
    })
      .then(res => {
        api.get(`/reviews/property/${id}`).then(r => setReviewsList(r.data.data || []));
        setNewReviewText('');
        dispatch(addToast({ message: 'Thank you for your feedback! Review added.', type: 'success' }));
        dispatch(fetchPropertyById(id));
      })
      .catch(err => {
        dispatch(addToast({ 
          message: err.response?.data?.message || 'Only guests with completed stays on this property can review.', 
          type: 'error' 
        }));
      });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 max-w-[1240px] mx-auto w-full px-6 md:px-12 py-10">
        
        {/* Title and Rating Head */}
        <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-3">
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              {tag && <span className="bg-forest text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">{tag}</span>}
              <span className="text-[13.5px] font-semibold text-forest-light bg-forest/5 px-2.5 py-1 rounded-md flex items-center gap-1">
                <MapPin size={12} />
                {city}, {state}, USA
              </span>
            </div>
            <h2 className="font-fraunces text-3xl md:text-[38px] font-medium leading-tight text-forest-dark">
              {name}
            </h2>
            <p className="text-[14.5px] text-charcoal-soft mt-1.5 font-medium">{address}</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 font-bold text-forest-dark">
              <Star size={18} className="fill-gold text-gold" />
              <span className="text-lg">{rating.toFixed(2)}</span>
              <span className="text-[13.5px] text-charcoal-soft font-normal">({reviewsList.length} reviews)</span>
            </div>
          </div>
        </div>

        {/* Premium Image Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10 rounded-2xl overflow-hidden shadow-sm">
          {/* Main Large Image */}
          <div 
            onClick={() => openLightbox(activeImageIdx)}
            className="md:col-span-2 h-[340px] md:h-[450px] bg-cream relative cursor-pointer group overflow-hidden"
            title="Click to view full photo gallery"
          >
            {images && images.length > 0 ? (
              <>
                <img 
                  src={images[activeImageIdx]} 
                  alt={`${name} gallery view`} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
                />
                <div className="absolute bottom-4 right-4 px-3 py-1.5 bg-black/60 hover:bg-black/80 text-white text-xs font-semibold rounded-lg backdrop-blur-sm flex items-center gap-1.5 transition-colors">
                  <Maximize2 size={13} />
                  <span>Expand Photo ({activeImageIdx + 1}/{images.length})</span>
                </div>
              </>
            ) : (
              <div className="photo"><span className="photo-label">Gallery photo</span></div>
            )}
          </div>
          {/* Side Thumbnail List */}
          <div className="grid grid-cols-3 md:grid-cols-1 gap-3 md:h-[450px] overflow-y-auto">
            {images && images.map((img, idx) => (
              <div 
                key={idx}
                onClick={() => {
                  setActiveImageIdx(idx);
                  openLightbox(idx);
                }}
                className={`cursor-pointer rounded-lg overflow-hidden border-2 h-[100px] md:h-[140px] bg-cream relative transition-all group ${
                  activeImageIdx === idx ? 'border-gold shadow-md' : 'border-transparent hover:border-cream-deep'
                }`}
                title="Click to expand this photo"
              >
                <img src={img} alt="thumbnail" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              </div>
            ))}
          </div>
        </div>

        {/* Detailed split screen layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
          
          {/* Left Columns: Stay Details */}
          <div className="lg:col-span-2 flex flex-col gap-9">
            
            {/* Short summary features */}
            <div className="flex items-center justify-between pb-6 border-b border-line gap-4 flex-wrap">
              <div>
                <h3 className="font-fraunces text-xl font-semibold text-forest-dark leading-snug">
                  Entire home hosted by {hostName || 'Sarah'}
                </h3>
                <p className="text-[13.5px] text-charcoal-soft mt-1">
                  {capacity} guests · {bedrooms} bedrooms · {beds} beds · {bathrooms} bathrooms
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-forest-light text-white font-fraunces font-bold flex items-center justify-center shadow-sm">
                {(hostName || 'S').slice(0, 2).toUpperCase()}
              </div>
            </div>

            {/* Stay Description */}
            <div>
              <h4 className="font-fraunces text-lg font-semibold text-forest-dark mb-3">About this cabin</h4>
              <p className="text-[14.5px] text-charcoal leading-relaxed font-inter font-normal">
                {description}
              </p>
            </div>

            {/* Amenities Section */}
            <div className="pb-6 border-b border-line">
              <h4 className="font-fraunces text-lg font-semibold text-forest-dark mb-4">What this place offers</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {amenities.map((amen) => (
                  <div key={amen} className="flex items-center gap-3 text-[14px] text-charcoal font-medium">
                    <CheckCircle size={16} className="text-forest-light" />
                    <span>{amen}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Host rules / timings */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-6 border-b border-line">
              <div>
                <h4 className="font-fraunces text-lg font-semibold text-forest-dark mb-3">House Rules</h4>
                <ul className="flex flex-col gap-2.5">
                  {houseRules && houseRules.map((rule, idx) => (
                    <li key={idx} className="text-[13.5px] text-charcoal font-normal flex items-start gap-2">
                      <span className="text-gold mt-0.5">•</span>
                      <span>{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex flex-col gap-4">
                <div>
                  <h4 className="font-fraunces text-md font-semibold text-forest-dark mb-1">Check-in / Checkout</h4>
                  <p className="text-[13.5px] text-charcoal">Check-in: {checkInTime || '3:00 PM'}</p>
                  <p className="text-[13.5px] text-charcoal">Checkout: {checkOutTime || '11:00 AM'}</p>
                </div>
                <div>
                  <h4 className="font-fraunces text-md font-semibold text-forest-dark mb-1">Cancellation Policy</h4>
                  <p className="text-[13px] text-charcoal-soft leading-normal">
                    {cancellationPolicy && cancellationPolicy !== 'Flexible cancellation.'
                      ? cancellationPolicy 
                      : 'Full refund (minus service fee) up to 7 days before check-in. 50% refund between 7 days and 48 hours. Non-refundable within 48 hours.'}
                  </p>
                  <Link 
                    to="/cancellation-policy" 
                    className="inline-block mt-1.5 text-[12px] font-semibold text-forest hover:text-forest-dark underline"
                  >
                    View detailed cancellation & refund policy →
                  </Link>
                </div>
              </div>
            </div>

            {/* Location Map Clickable Card */}
            <div>
              <h4 className="font-fraunces text-lg font-semibold text-forest-dark mb-3.5">Where you'll be</h4>
              <button 
                type="button"
                onClick={handleMapRedirect}
                className="w-full h-[250px] bg-cream-deep hover:bg-cream-deep/80 border border-line rounded-2xl relative overflow-hidden flex flex-col justify-center items-center text-center px-4 shadow-inner group transition-all duration-300 hover:shadow-md cursor-pointer focus:outline-none"
              >
                <MapPin size={38} className="text-forest mb-2.5 group-hover:scale-110 transition-transform duration-300 animate-bounce" />
                <h5 className="font-fraunces text-[15.5px] font-semibold text-forest-dark">{city}, {state}</h5>
                <p className="text-charcoal-soft text-[12px] max-w-[280px] mt-1">Exact location is provided upon booking confirmation.</p>
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,rgba(8,69,62,0.4)_0%,transparent_70%)] bg-cover" />
              </button>
            </div>

            {/* Reviews section */}
            <div>
              <h4 className="font-fraunces text-lg font-semibold text-forest-dark mb-4">Guest Reviews ({reviewsList.length})</h4>
              <div className="grid grid-cols-1 gap-5 mb-8">
                {reviewsList.map((rev) => (
                  <div key={rev._id || rev.id} className="p-5 bg-cream/40 border border-line rounded-xl flex flex-col gap-3">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-forest text-white font-fraunces font-bold flex items-center justify-center text-xs overflow-hidden">
                          {rev.customer?.profileImage ? (
                            <img src={rev.customer.profileImage} alt={rev.customer?.name} className="w-full h-full object-cover" />
                          ) : (
                            (rev.customer?.name || 'G').slice(0, 2).toUpperCase()
                          )}
                        </div>
                        <div>
                          <h5 className="text-[13.5px] font-semibold text-forest-dark">{rev.customer?.name || 'Guest'}</h5>
                          <span className="text-[11.5px] text-charcoal-soft">
                            {new Date(rev.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 font-bold text-forest-dark text-[13.5px]">
                        <Star size={13} className="fill-gold text-gold" />
                        <span>{rev.rating ? rev.rating.toFixed(1) : '5.0'}</span>
                      </div>
                    </div>
                    <p className="text-[13.5px] text-charcoal leading-relaxed font-normal">{rev.comment}</p>
                  </div>
                ))}
              </div>

              {/* Review submit form */}
              <form onSubmit={handleAddReview} className="bg-white border border-line rounded-xl p-5 flex flex-col gap-4">
                <h5 className="font-fraunces text-[15px] font-semibold text-forest-dark">Leave a review</h5>
                <div className="flex items-center gap-3">
                  <label className="text-[12px] font-bold text-charcoal-soft uppercase tracking-wider">Rating:</label>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <button 
                        key={num} 
                        type="button" 
                        onClick={() => setNewReviewRating(num)}
                        className="text-gold focus:outline-none"
                      >
                        <Star size={18} className={newReviewRating >= num ? 'fill-gold' : 'text-gray-300'} />
                      </button>
                    ))}
                  </div>
                </div>
                <textarea 
                  rows="3" 
                  placeholder="Share your stay experience..." 
                  value={newReviewText}
                  onChange={(e) => setNewReviewText(e.target.value)}
                  className="w-full bg-cream/30 border border-line rounded-xl p-4 text-[13.5px] text-charcoal focus:outline-none focus:border-forest-light"
                />
                <button 
                  type="submit"
                  className="self-end px-5 py-2.5 bg-forest text-white font-semibold rounded-full text-[13px] hover:bg-forest-light shadow-sm"
                >
                  Submit Review
                </button>
              </form>
            </div>

          </div>

          {/* Right Column: Dynamic Booking Card */}
          <div className="sticky top-28 bg-white border border-line rounded-2xl shadow-cozy p-6 flex flex-col gap-5">
            <div className="flex justify-between items-end">
              <div className="font-inter text-2xl font-bold text-forest-dark">
                ₹{price} <span className="text-[13.5px] font-normal text-charcoal-soft">/ night</span>
              </div>
              <div className="flex items-center gap-1 text-[13.5px] font-bold text-forest-dark">
                <Star size={14} className="fill-gold text-gold" />
                <span>{rating.toFixed(2)}</span>
              </div>
            </div>

            <form onSubmit={handleBooking} className="flex flex-col gap-4">
              
              {/* Date displays (populated by interactive calendar below) */}
              <div 
                onClick={() => setShowCalendar(!showCalendar)}
                className="grid grid-cols-2 border border-line rounded-xl divide-x divide-line bg-cream/5 cursor-pointer hover:bg-cream-deep/5 transition-all animate-none"
              >
                <div className="p-3">
                  <label className="text-[9.5px] font-bold text-charcoal-soft uppercase tracking-wider block mb-1">Check-in</label>
                  <input 
                    type="text"
                    placeholder="Select below"
                    value={checkIn}
                    readOnly
                    className="w-full bg-transparent text-[13px] font-semibold text-forest-dark focus:outline-none cursor-default"
                    required
                  />
                </div>
                <div className="p-3">
                  <label className="text-[9.5px] font-bold text-charcoal-soft uppercase tracking-wider block mb-1">Checkout</label>
                  <input 
                    type="text"
                    placeholder="Select below"
                    value={checkOut}
                    readOnly
                    className="w-full bg-transparent text-[13px] font-semibold text-forest-dark focus:outline-none cursor-default"
                    required
                  />
                </div>
              </div>

              {/* Guest selector */}
              <div className="border border-line rounded-xl p-3 relative">
                <div 
                  onClick={() => setShowGuestDropdown(!showGuestDropdown)}
                  className="cursor-pointer select-none"
                >
                  <label className="text-[9.5px] font-bold text-charcoal-soft uppercase tracking-wider block mb-1">Guests</label>
                  <div className="flex justify-between items-center text-[13px] font-semibold text-forest-dark">
                    <span>{adults + children} guests</span>
                    <ChevronDown size={14} className="text-charcoal-soft" />
                  </div>
                </div>

                {showGuestDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-line rounded-xl shadow-lg p-4 z-20 flex flex-col gap-3.5">
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-[13px] font-semibold text-forest-dark block">Adults</span>
                        <span className="text-[11px] text-charcoal-soft">Ages 13+</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <button 
                          type="button" 
                          onClick={() => setAdults(Math.max(1, adults - 1))}
                          className="w-7 h-7 rounded-full border border-line flex items-center justify-center font-bold text-sm"
                        >
                          -
                        </button>
                        <span className="text-[13px] font-semibold w-3 text-center">{adults}</span>
                        <button 
                          type="button" 
                          onClick={() => setAdults(adults + 1)}
                          className="w-7 h-7 rounded-full border border-line flex items-center justify-center font-bold text-sm"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-[13px] font-semibold text-forest-dark block">Children</span>
                        <span className="text-[11px] text-charcoal-soft">Ages 2-12</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <button 
                          type="button" 
                          onClick={() => setChildren(Math.max(0, children - 1))}
                          className="w-7 h-7 rounded-full border border-line flex items-center justify-center font-bold text-sm"
                        >
                          -
                        </button>
                        <span className="text-[13px] font-semibold w-3 text-center">{children}</span>
                        <button 
                          type="button" 
                          onClick={() => setChildren(children + 1)}
                          className="w-7 h-7 rounded-full border border-line flex items-center justify-center font-bold text-sm"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <button 
                      type="button" 
                      onClick={() => setShowGuestDropdown(false)}
                      className="w-full py-1.5 bg-cream text-forest-dark font-semibold text-[12px] rounded-lg"
                    >
                      Apply
                    </button>
                  </div>
                )}
              </div>

              {/* Custom Interactive Calendar Widget */}
              {showCalendar && (
                <div className="border border-line rounded-xl p-3.5 bg-cream/10 relative z-10 animate-fade-in">
                {/* Month navigation header */}
                <div className="flex justify-between items-center mb-3">
                  <span className="text-[12px] font-bold text-forest-dark">
                    {monthNames[calMonth]} {calYear}
                  </span>
                  <div className="flex gap-1.5">
                    <button 
                      type="button"
                      onClick={handlePrevCalMonth}
                      disabled={isPrevCalDisabled}
                      className={`p-1 border border-line rounded transition-colors ${
                        isPrevCalDisabled 
                          ? 'opacity-30 cursor-not-allowed text-charcoal-soft' 
                          : 'hover:bg-cream/45 text-charcoal hover:text-forest cursor-pointer'
                      }`}
                      title={isPrevCalDisabled ? 'Cannot go to past months' : 'Previous Month'}
                    >
                      <ChevronLeft size={12} />
                    </button>
                    <button 
                      type="button"
                      onClick={handleNextCalMonth}
                      disabled={isNextCalDisabled}
                      className={`p-1 border border-line rounded transition-colors ${
                        isNextCalDisabled 
                          ? 'opacity-30 cursor-not-allowed text-charcoal-soft' 
                          : 'hover:bg-cream/45 text-charcoal hover:text-forest cursor-pointer'
                      }`}
                      title={isNextCalDisabled ? `Advance limit reached (${bookingWindowMonths || 3} months)` : 'Next Month'}
                    >
                      <ChevronRight size={12} />
                    </button>
                  </div>
                </div>

                {/* Day labels */}
                <div className="grid grid-cols-7 text-center font-bold text-[8.5px] text-charcoal-soft uppercase tracking-wider mb-2">
                  <span>Su</span>
                  <span>Mo</span>
                  <span>Tu</span>
                  <span>We</span>
                  <span>Th</span>
                  <span>Fr</span>
                  <span>Sa</span>
                </div>

                {/* Calendar Days Grid */}
                <div className="grid grid-cols-7 gap-1">
                  {calDaysArray.map((day, idx) => {
                    if (!day) {
                      return <div key={`empty-${idx}`} className="aspect-square" />;
                    }

                    const dateStr = getCalDateString(day);
                    const status = getCalDateStatus(day);
                    const priceVal = getCalDatePrice(day);

                    // Selection classes
                    const isStart = checkIn && dateStr === checkIn;
                    const isEnd = checkOut && dateStr === checkOut;
                    const isRange = checkIn && checkOut && dateStr > checkIn && dateStr < checkOut;

                    const isDisabled = status === 'past' || status === 'beyond_window' || status === 'blocked' || status === 'booked';

                    let bgClass = '';
                    let textClass = 'text-charcoal';
                    let borderClass = 'border-transparent';

                    if (isDisabled) {
                      bgClass = 'bg-gray-50 opacity-40 cursor-not-allowed';
                      textClass = 'text-charcoal-soft line-through';
                      borderClass = 'border-line/40';
                    } else {
                      // Available
                      bgClass = 'bg-emerald-50/70 hover:bg-emerald-100/70 cursor-pointer';
                      textClass = 'text-emerald-800';
                      borderClass = 'border-emerald-100/30';
                    }

                    // Selected states override background and text colors
                    if (isStart || isEnd) {
                      bgClass = 'bg-forest';
                      textClass = 'text-white font-bold';
                      borderClass = 'border-forest';
                    } else if (isRange) {
                      bgClass = 'bg-forest/10';
                      textClass = 'text-forest font-bold';
                      borderClass = 'border-forest/5';
                    }

                    return (
                      <button
                        key={`day-${day}`}
                        type="button"
                        onClick={() => handleDateClick(day)}
                        disabled={isDisabled}
                        className={`w-full aspect-square border rounded-lg flex flex-col justify-center items-center transition-all ${bgClass} ${textClass} ${borderClass} focus:outline-none`}
                        title={
                          status === 'past' 
                            ? 'Past date' 
                            : status === 'beyond_window' 
                            ? `Advance booking limit reached (${bookingWindowMonths || 3} months)` 
                            : status === 'blocked' || status === 'booked' 
                            ? 'Date unavailable / booked' 
                            : `₹${priceVal} / night`
                        }
                      >
                        <span className="text-[10px] font-bold leading-none">{day}</span>
                        {!isDisabled && (
                          <span className={`text-[6.5px] mt-0.5 font-extrabold ${isStart || isEnd ? 'text-white' : 'text-forest'}`}>
                            ₹{priceVal}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Close Calendar Action Button */}
                <button
                  type="button"
                  onClick={() => setShowCalendar(false)}
                  className="w-full mt-3 py-2.5 bg-forest hover:bg-forest-light text-white font-bold text-[11px] rounded-xl shadow-sm transition-colors cursor-pointer"
                >
                  Close Calendar
                </button>
              </div>
              )}

              {/* Dynamic calculations display */}
              {nights > 0 && (
                <div className="flex flex-col gap-3 pt-3 border-t border-line text-[13.5px]">
                  {loadingPricing ? (
                    <div className="py-2 text-center text-charcoal-soft animate-pulse">Calculating rates...</div>
                  ) : (
                    <>
                      <div className="flex justify-between text-charcoal">
                        <span>{pricingBreakdown && pricingBreakdown.subtotal !== (price * nights) ? 'Stay subtotal (custom rates)' : `₹${price} × ${nights} nights`}</span>
                        <span>₹{baseCost}</span>
                      </div>
                      <div className="flex justify-between text-charcoal">
                        <span>Service fee</span>
                        <span>₹{serviceFee}</span>
                      </div>
                      <div className="flex justify-between font-bold text-forest-dark pt-3 border-t border-line text-[15px]">
                        <span>Total Amount</span>
                        <span>₹{totalAmount}</span>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Reservation submit CTA */}
              <button 
                type="submit"
                className="w-full py-3.5 bg-forest hover:bg-forest-light text-white font-semibold rounded-xl text-[14.5px] text-center shadow-md hover:translate-y-[-1px] transition-all"
              >
                {nights > 0 ? 'Reserve Stay' : 'Check Availability'}
              </button>
            </form>

            <span className="text-center text-[12px] text-charcoal-soft font-normal">
              You won't be charged yet.
            </span>
          </div>

        </div>

      </main>

      {/* Fullscreen Interactive Image Lightbox Slider */}
      {isLightboxOpen && images && images.length > 0 && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 flex flex-col justify-between p-4 sm:p-6 backdrop-blur-sm select-none animate-in fade-in duration-200"
          onClick={closeLightbox}
        >
          {/* Top Bar: Counter, Title, Close button */}
          <div className="flex items-center justify-between text-white z-10" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-white/10 rounded-full text-xs font-semibold tracking-wider text-cream">
                {lightboxIdx + 1} / {images.length}
              </span>
              <span className="text-sm font-medium text-cream-soft hidden sm:inline-block truncate max-w-md">
                {name}
              </span>
            </div>
            <button
              type="button"
              onClick={closeLightbox}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
              title="Close (Esc)"
            >
              <X size={20} />
            </button>
          </div>

          {/* Main Image Stage with Next & Prev buttons */}
          <div className="relative flex-1 flex items-center justify-center my-2 max-h-[78vh]">
            {/* Previous Button */}
            {images.length > 1 && (
              <button
                type="button"
                onClick={handlePrevImage}
                className="absolute left-2 sm:left-6 z-20 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-black/50 hover:bg-black/80 border border-white/20 text-white flex items-center justify-center shadow-lg transition-transform hover:scale-105 cursor-pointer"
                title="Previous photo (Left arrow)"
              >
                <ChevronLeft size={26} />
              </button>
            )}

            {/* The Active Single Photo */}
            <div 
              className="w-full h-full flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img 
                src={images[lightboxIdx]} 
                alt={`${name} view ${lightboxIdx + 1}`}
                className="max-h-[75vh] max-w-full object-contain rounded-xl shadow-2xl transition-all duration-300"
              />
            </div>

            {/* Next Button */}
            {images.length > 1 && (
              <button
                type="button"
                onClick={handleNextImage}
                className="absolute right-2 sm:right-6 z-20 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-black/50 hover:bg-black/80 border border-white/20 text-white flex items-center justify-center shadow-lg transition-transform hover:scale-105 cursor-pointer"
                title="Next photo (Right arrow)"
              >
                <ChevronRight size={26} />
              </button>
            )}
          </div>

          {/* Bottom Thumbnails Strip */}
          {images.length > 1 && (
            <div 
              className="flex items-center justify-center gap-2 overflow-x-auto py-2 z-10 px-4"
              onClick={(e) => e.stopPropagation()}
            >
              {images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setLightboxIdx(idx)}
                  className={`w-14 h-11 sm:w-18 sm:h-13 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 cursor-pointer ${
                    lightboxIdx === idx ? 'border-gold scale-105 shadow-md' : 'border-white/20 opacity-50 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <Footer />
    </div>
  );
}
