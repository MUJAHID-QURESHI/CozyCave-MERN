import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, CreditCard, ShieldCheck, Mail, Phone, User, Calendar, Users, MapPin } from 'lucide-react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import api from '../../services/api';
import { addToast } from '../../redux/slices/uiSlice';

// Helper to load Razorpay SDK dynamically
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function Checkout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { currentBooking } = useSelector((state) => state.bookings);
  const { user } = useSelector((state) => state.auth);
  const { serviceFeePercent = 2 } = useSelector((state) => state.settings);

  // Form states
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      setFullName(user.name || '');
      setEmail(user.email || '');
      setMobile(user.mobile || '');
    }
  }, [user]);

  // If no booking is pending, redirect back to listings
  if (!currentBooking) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center py-20 px-4">
          <ShieldCheck size={48} className="text-red-500 mb-4" />
          <h3 className="font-fraunces text-xl font-semibold text-forest-dark mb-2">No active booking session</h3>
          <p className="text-charcoal-soft text-[14.5px] mb-6">Select a property and check availability before proceeding to checkout.</p>
          <Link to="/properties" className="px-6 py-2.5 bg-forest text-white rounded-full font-semibold text-[13.5px]">
            View Properties
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const {
    propertyId, propertyName, propertyImage, propertyLocation,
    checkIn, checkOut, guests, nights, pricePerNight,
    serviceFee
  } = currentBooking;

  const displaySubtotal = currentBooking.subtotal || (pricePerNight * nights);
  const feePercent = (serviceFeePercent !== undefined && serviceFeePercent !== null) ? Number(serviceFeePercent) : 2;
  const displayServiceFee = serviceFee !== undefined ? serviceFee : Math.ceil(displaySubtotal * (feePercent / 100));
  const displayTotal = displaySubtotal + displayServiceFee;

  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();

    if (!fullName.trim() || !email.trim() || !mobile.trim()) {
      dispatch(addToast({ message: 'Please fill in all guest information details', type: 'warning' }));
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Create a pending booking on backend
      const bookingRes = await api.post('/bookings', {
        propertyId,
        checkIn,
        checkOut,
        guests,
        guestDetails: {
          name: fullName,
          email,
          mobile,
        }
      });

      const dbBooking = bookingRes.data.data;

      // 2. Create Razorpay order
      const orderRes = await api.post('/payments/create-order', {
        bookingId: dbBooking._id,
      });

      const orderData = orderRes.data.data;

      // 3. Check if running in mock payment mode
      if (orderData.mock) {
        // Direct simulation callback for mock checkout
        setTimeout(async () => {
          try {
            await api.post('/payments/verify', {
              razorpayOrderId: orderData.orderId,
              razorpayPaymentId: 'pay_mock_' + Math.random().toString(36).substring(2, 9),
            });
            dispatch(addToast({ message: 'Mock payment verified and booking confirmed!', type: 'success' }));
            setIsSubmitting(false);
            navigate('/booking-confirmation');
          } catch (err) {
            dispatch(addToast({ message: err.response?.data?.message || 'Payment simulation failed', type: 'error' }));
            setIsSubmitting(false);
          }
        }, 1500);
      } else {
        // Load real Razorpay checkout modal
        const isScriptLoaded = await loadRazorpayScript();
        if (!isScriptLoaded) {
          dispatch(addToast({ message: 'Failed to load Razorpay SDK. Please check your network.', type: 'error' }));
          setIsSubmitting(false);
          return;
        }

        const options = {
          key: orderData.keyId || import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_yourkeyid',
          amount: orderData.amount,
          currency: orderData.currency,
          name: 'CozyCave Stays',
          description: `Stay reservation at ${propertyName}`,
          order_id: orderData.orderId,
          handler: async (response) => {
            try {
              setIsSubmitting(true);
              await api.post('/payments/verify', {
                razorpayOrderId: orderData.orderId,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              });
              dispatch(addToast({ message: 'Payment verified and booking confirmed!', type: 'success' }));
              setIsSubmitting(false);
              navigate('/booking-confirmation');
            } catch (err) {
              dispatch(addToast({ message: err.response?.data?.message || 'Signature verification failed', type: 'error' }));
              setIsSubmitting(false);
            }
          },
          prefill: {
            name: fullName,
            email: email,
            contact: mobile,
          },
          theme: {
            color: '#08453e',
          },
          modal: {
            ondismiss: () => {
              dispatch(addToast({ message: 'Payment cancelled by user', type: 'warning' }));
              setIsSubmitting(false);
            }
          }
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      }
    } catch (error) {
      dispatch(addToast({ message: error.response?.data?.message || 'Checkout failed', type: 'error' }));
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 max-w-[1240px] mx-auto w-full px-6 md:px-12 py-10">
        
        {/* Back Link */}
        <div className="mb-6">
          <Link 
            to={`/properties/${propertyId}`}
            className="flex items-center gap-1.5 text-[13.5px] font-semibold text-forest hover:underline"
          >
            <ArrowLeft size={16} />
            <span>Back to Property details</span>
          </Link>
        </div>

        {/* Head title */}
        <h2 className="font-fraunces text-3xl md:text-4xl font-medium text-forest-dark mb-10">
          Confirm and Pay
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Forms (8 grid cols) */}
          <div className="lg:col-span-7 flex flex-col gap-9">
            
            {/* Form: Guest details */}
            <div className="bg-white border border-line rounded-2xl p-6">
              <h3 className="font-fraunces text-lg md:text-xl font-semibold text-forest-dark mb-5">
                Guest Information
              </h3>
              
              <form onSubmit={handleCheckoutSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-charcoal uppercase tracking-wider flex items-center gap-1.5">
                    <User size={13} className="text-forest" />
                    Full Name
                  </label>
                  <input 
                    type="text" 
                    placeholder="Enter your full name" 
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-cream/30 border border-line rounded-xl py-3 px-4 text-[14px] text-forest-dark font-medium focus:outline-none focus:border-forest-light"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-charcoal uppercase tracking-wider flex items-center gap-1.5">
                      <Mail size={13} className="text-forest" />
                      Email Address
                    </label>
                    <input 
                      type="email" 
                      placeholder="you@example.com" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-cream/30 border border-line rounded-xl py-3 px-4 text-[14px] text-forest-dark font-medium focus:outline-none focus:border-forest-light"
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-charcoal uppercase tracking-wider flex items-center gap-1.5">
                      <Phone size={13} className="text-forest" />
                      Mobile Number
                    </label>
                    <input 
                      type="tel" 
                      placeholder="+1 (828) 555-0000" 
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      className="w-full bg-cream/30 border border-line rounded-xl py-3 px-4 text-[14px] text-forest-dark font-medium focus:outline-none focus:border-forest-light"
                      required
                    />
                  </div>
                </div>
              </form>
            </div>

            {/* Payment Section (Mock/Razorpay Ready) */}
            <div className="bg-white border border-line rounded-2xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-fraunces text-lg md:text-xl font-semibold text-forest-dark flex items-center gap-2">
                  <CreditCard size={20} className="text-forest" />
                  Payment Details
                </h3>
                <span className="text-[11px] font-bold text-gold uppercase tracking-wider bg-gold/10 px-2.5 py-1 rounded-md">
                  Secure Checkout
                </span>
              </div>
              
              <p className="text-[13px] text-charcoal-soft mb-6 leading-relaxed">
                Clicking confirm will launch the payment gateway mock integration. In production, this resolves the custom API request and triggers Razorpay UI dynamically.
              </p>

              {/* Payment selection mock */}
              <div className="border-2 border-forest/15 bg-forest/5 rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <input 
                    type="radio" 
                    checked={true} 
                    readOnly
                    className="w-4 h-4 text-forest focus:ring-forest cursor-pointer" 
                  />
                  <div>
                    <span className="text-[13.5px] font-bold text-forest-dark block">Razorpay Gateway Integration</span>
                    <span className="text-[11px] text-charcoal-soft font-normal">Supports Cards, Netbanking, UPI, and Wallets</span>
                  </div>
                </div>
                <div className="flex gap-1.5 text-forest font-extrabold font-serif italic text-sm">
                  Rzpay
                </div>
              </div>

              {/* Confirm submit CTA */}
              <button 
                onClick={handleCheckoutSubmit}
                disabled={isSubmitting}
                className="w-full mt-6 py-4 bg-forest hover:bg-forest-light text-white font-semibold rounded-xl text-[14.5px] text-center shadow-md hover:translate-y-[-1px] disabled:bg-forest/50 disabled:translate-y-0 transition-all flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                    <span>Processing Payment...</span>
                  </>
                ) : (
                  <span>Pay & Confirm Booking (₹{displayTotal})</span>
                )}
              </button>
            </div>

          </div>

          {/* Right Column: Trip & Price Summary (5 grid cols) */}
          <div className="lg:col-span-5 bg-white border border-line rounded-2xl p-6 shadow-sm flex flex-col gap-6">
            
            {/* Property details */}
            <div className="flex gap-4 pb-5 border-b border-line">
              <div className="w-24 h-20 rounded-xl overflow-hidden bg-cream flex-shrink-0">
                {propertyImage ? (
                  <img src={propertyImage} alt={propertyName} className="w-full h-full object-cover" />
                ) : (
                  <div className="photo" />
                )}
              </div>
              <div className="flex flex-col justify-center">
                <h4 className="font-fraunces text-md font-semibold text-forest-dark leading-tight mb-1">
                  {propertyName}
                </h4>
                <p className="text-[12.5px] text-charcoal-soft font-normal leading-none flex items-center gap-1">
                  <MapPin size={12} />
                  {propertyLocation}
                </p>
              </div>
            </div>

            {/* Trip details summary */}
            <div className="flex flex-col gap-3 pb-5 border-b border-line">
              <h4 className="font-fraunces text-md font-semibold text-forest-dark">
                Trip Details
              </h4>
              <div className="flex items-center gap-3 text-[13.5px] text-charcoal">
                <Calendar size={14} className="text-forest" />
                <div>
                  <span className="font-bold">Dates: </span>
                  <span>{checkIn} to {checkOut}</span>
                  <span className="text-charcoal-soft font-medium"> ({nights} nights)</span>
                </div>
              </div>
              <div className="flex items-center gap-3 text-[13.5px] text-charcoal">
                <Users size={14} className="text-forest" />
                <div>
                  <span className="font-bold">Guests: </span>
                  <span>{guests.adults} adults{guests.children > 0 && `, ${guests.children} children`}</span>
                </div>
              </div>
            </div>

            {/* Price breakdown */}
            <div className="flex flex-col gap-3.5 text-[13.5px]">
              <h4 className="font-fraunces text-md font-semibold text-forest-dark">
                Price Breakdown
              </h4>
              <div className="flex justify-between text-charcoal">
                <span>₹{pricePerNight} × {nights} nights</span>
                <span className="font-medium">₹{displaySubtotal}</span>
              </div>
              <div className="flex justify-between text-charcoal">
                <span>Service fee</span>
                <span className="font-medium">₹{displayServiceFee}</span>
              </div>
              <div className="flex justify-between font-bold text-forest-dark pt-3 border-t border-line text-[15.5px]">
                <span>Total (INR)</span>
                <span>₹{displayTotal}</span>
              </div>
            </div>

          </div>

        </div>

      </main>

      <Footer />
    </div>
  );
}
