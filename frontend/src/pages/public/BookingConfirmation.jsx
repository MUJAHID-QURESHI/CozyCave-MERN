import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Check, Calendar, Users, MapPin, Printer, Home, Briefcase, ChevronRight } from 'lucide-react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { addToast } from '../../redux/slices/uiSlice';

export default function BookingConfirmation() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { confirmedBooking } = useSelector((state) => state.bookings);

  // If no confirmed booking exists, redirect back to listings
  if (!confirmedBooking) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center py-20 px-4">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4">
            <Printer size={28} />
          </div>
          <h3 className="font-fraunces text-xl font-semibold text-forest-dark mb-2">No confirmed booking session</h3>
          <p className="text-charcoal-soft text-[14.5px] mb-6">Select a property and complete checkout to view confirmation details.</p>
          <Link to="/properties" className="px-6 py-2.5 bg-forest text-white rounded-full font-semibold text-[13.5px]">
            View Properties
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const {
    id, propertyName, propertyImage, propertyLocation,
    checkIn, checkOut, guests, nights, pricePerNight,
    totalAmount, paymentStatus, userName, userEmail, userMobile
  } = confirmedBooking;

  const handlePrint = () => {
    window.print();
    dispatch(addToast({ message: 'Downloading/Printing receipt...', type: 'info' }));
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 max-w-[700px] mx-auto w-full px-6 py-16">
        
        {/* Success Header banner */}
        <div className="flex flex-col items-center text-center mb-10">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mb-4 shadow-sm">
            <Check size={32} className="stroke-[3]" />
          </div>
          <h2 className="font-fraunces text-3xl md:text-4xl font-semibold text-forest-dark mb-2">
            Booking Confirmed 🎉
          </h2>
          <p className="text-charcoal-soft text-[14.5px] max-w-sm">
            Your stay is locked in. We have sent a confirmation email to <strong className="text-forest-dark">{userEmail}</strong>.
          </p>
        </div>

        {/* Invoice styled receipt details */}
        <div className="bg-white border border-line rounded-2xl shadow-cozy overflow-hidden mb-10 print:border-none print:shadow-none">
          {/* Header invoice info */}
          <div className="bg-forest text-white p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-cream/70">Booking Reference</span>
              <h3 className="font-inter text-xl font-bold tracking-wide mt-0.5">{id}</h3>
            </div>
            <span className="text-[12.5px] font-bold text-forest-dark bg-gold px-3.5 py-1.5 rounded-full">
              Status: {paymentStatus === 'Paid' ? 'Paid & Confirmed' : 'Confirmed'}
            </span>
          </div>

          <div className="p-6 sm:p-8 flex flex-col gap-6">
            
            {/* Stay Info */}
            <div className="flex gap-4 pb-5 border-b border-line items-center">
              <div className="w-20 h-16 rounded-lg overflow-hidden bg-cream flex-shrink-0">
                {propertyImage ? (
                  <img src={propertyImage} alt={propertyName} className="w-full h-full object-cover" />
                ) : (
                  <div className="photo" />
                )}
              </div>
              <div>
                <h4 className="font-fraunces text-[16px] font-semibold text-forest-dark mb-1">
                  {propertyName}
                </h4>
                <p className="text-[12.5px] text-charcoal-soft flex items-center gap-1">
                  <MapPin size={12} />
                  {propertyLocation}
                </p>
              </div>
            </div>

            {/* Trip Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-5 border-b border-line">
              <div className="flex items-start gap-2.5">
                <Calendar size={15} className="text-forest mt-0.5 flex-shrink-0" />
                <div>
                  <span className="text-[11px] font-bold text-charcoal-soft uppercase tracking-wider block">Trip Timings</span>
                  <span className="text-[13.5px] text-charcoal font-semibold">{checkIn} to {checkOut}</span>
                  <span className="text-[12.5px] text-charcoal-soft block font-medium">({nights} nights stay)</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Users size={15} className="text-forest mt-0.5 flex-shrink-0" />
                <div>
                  <span className="text-[11px] font-bold text-charcoal-soft uppercase tracking-wider block">Guests Registered</span>
                  <span className="text-[13.5px] text-charcoal font-semibold">
                    {guests.adults} adults{guests.children > 0 && `, ${guests.children} children`}
                  </span>
                </div>
              </div>
            </div>

            {/* Customer Details info */}
            <div className="pb-5 border-b border-line">
              <span className="text-[11px] font-bold text-charcoal-soft uppercase tracking-wider block mb-2">Guest Profile</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[13px] text-charcoal font-semibold">
                <div>Name: <span className="font-medium text-charcoal-soft">{userName}</span></div>
                <div>Phone: <span className="font-medium text-charcoal-soft">{userMobile}</span></div>
                <div className="sm:col-span-2">Email: <span className="font-medium text-charcoal-soft">{userEmail}</span></div>
              </div>
            </div>

            {/* Receipt Summary pricing */}
            <div className="flex justify-between items-end bg-cream/45 p-4 rounded-xl">
              <div>
                <span className="text-[11px] font-bold text-charcoal-soft uppercase tracking-wider block">Amount Paid</span>
                <span className="text-[12px] text-charcoal-soft font-normal">All fees included</span>
              </div>
              <div className="font-inter text-2xl font-bold text-forest-dark">
                ₹{totalAmount}
              </div>
            </div>

          </div>
        </div>

        {/* Option action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 items-stretch print:hidden">
          <button 
            onClick={handlePrint}
            className="flex-1 py-3 px-5 border border-line rounded-full font-semibold text-[14px] text-forest-dark hover:bg-cream/40 flex items-center justify-center gap-1.5"
          >
            <Printer size={16} />
            <span>Download Receipt</span>
          </button>
          
          <Link 
            to="/my-bookings"
            className="flex-1 py-3 px-5 bg-cream hover:bg-cream-deep text-forest-dark font-semibold rounded-full text-[14px] flex items-center justify-center gap-1.5"
          >
            <Briefcase size={16} />
            <span>View My Bookings</span>
          </Link>

          <Link 
            to="/"
            className="flex-1 py-3 px-5 bg-forest hover:bg-forest-light text-white font-semibold rounded-full text-[14px] flex items-center justify-center gap-1.5"
          >
            <Home size={16} />
            <span>Back to Home</span>
          </Link>
        </div>

      </main>

      <Footer />
    </div>
  );
}
