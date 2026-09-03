import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { Calendar, Users, MapPin, XCircle, Info, Star } from 'lucide-react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { fetchMyBookings, cancelBookingThunk } from '../../redux/slices/bookingSlice';
import { addToast } from '../../redux/slices/uiSlice';
import Modal from '../../components/common/Modal';

export default function MyBookings() {
  const dispatch = useDispatch();
  const { bookings } = useSelector((state) => state.bookings);
  const { user } = useSelector((state) => state.auth);

  const [activeTab, setActiveTab] = useState('upcoming'); // 'upcoming', 'completed', 'cancelled'
  const [selectedCancelId, setSelectedCancelId] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);

  useEffect(() => {
    dispatch(fetchMyBookings());
  }, [dispatch]);

  // Convert populated database booking format to match what JSX layout expects
  const userBookings = (bookings || []).map(b => {
    const status = b.bookingStatus ? b.bookingStatus.charAt(0).toUpperCase() + b.bookingStatus.slice(1) : 'Pending';
    return {
      ...b,
      id: b._id,
      propertyName: b.property?.name || 'Stay',
      propertyImage: b.property?.images?.[0] || null,
      propertyLocation: b.property ? `${b.property.location?.city || b.property.city}, ${b.property.location?.state || b.property.state}` : '',
      checkIn: b.checkIn ? new Date(b.checkIn).toISOString().split('T')[0] : '',
      checkOut: b.checkOut ? new Date(b.checkOut).toISOString().split('T')[0] : '',
      status,
    };
  });

  const filterBookingsByTab = () => {
    const today = new Date().toISOString().split('T')[0];
    
    if (activeTab === 'upcoming') {
      return userBookings.filter(b => b.status !== 'Cancelled' && b.checkIn >= today);
    } else if (activeTab === 'completed') {
      return userBookings.filter(b => b.status === 'Completed' || (b.status === 'Confirmed' && b.checkOut < today));
    } else if (activeTab === 'cancelled') {
      return userBookings.filter(b => b.status === 'Cancelled');
    }
    return [];
  };

  const currentList = filterBookingsByTab();

  const handleCancelClick = (id) => {
    setSelectedCancelId(id);
    setShowCancelModal(true);
  };

  const confirmCancel = () => {
    dispatch(cancelBookingThunk({ bookingId: selectedCancelId, reason: 'Cancelled by guest' }))
      .unwrap()
      .then(() => {
        dispatch(addToast({ message: 'Booking has been successfully cancelled.', type: 'info' }));
        dispatch(fetchMyBookings());
      })
      .catch(err => {
        dispatch(addToast({ message: err || 'Cancellation failed', type: 'error' }));
      });
    setShowCancelModal(false);
    setSelectedCancelId(null);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 max-w-[1000px] mx-auto w-full px-6 md:px-12 py-12">
        
        <h2 className="font-fraunces text-3xl font-semibold text-forest-dark mb-10">My Bookings</h2>

        {/* Tab Controls */}
        <div className="flex border-b border-line mb-8 gap-6">
          {['upcoming', 'completed', 'cancelled'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 text-sm font-semibold capitalize relative transition-all duration-200 ${
                activeTab === tab ? 'text-forest font-bold' : 'text-charcoal-soft hover:text-forest-light'
              }`}
            >
              {tab} stays
              {activeTab === tab && (
                <span className="absolute bottom-[-1px] left-0 right-0 h-[2.5px] bg-gold rounded-full" />
              )}
            </button>
          ))}
        </div>

        {/* Bookings Display list */}
        {currentList.length > 0 ? (
          <div className="flex flex-col gap-6">
            {currentList.map((booking) => {
              const {
                id, propertyName, propertyImage, propertyLocation,
                checkIn, checkOut, guests, totalAmount, status
              } = booking;

              return (
                <div 
                  key={id}
                  className="bg-white border border-line rounded-2xl p-5 sm:p-6 shadow-cozy-sm hover:shadow-md transition-shadow flex flex-col md:flex-row gap-6 items-start md:items-center"
                >
                  {/* Image */}
                  <div className="w-full md:w-36 h-28 rounded-xl overflow-hidden bg-cream flex-shrink-0">
                    {propertyImage ? (
                      <img src={propertyImage} alt={propertyName} className="w-full h-full object-cover" />
                    ) : (
                      <div className="photo" />
                    )}
                  </div>

                  {/* Booking details */}
                  <div className="flex-1 flex flex-col gap-2">
                    <div className="flex justify-between items-start gap-4 flex-wrap">
                      <div>
                        <h3 className="font-fraunces text-lg font-semibold text-forest-dark leading-tight mb-1">
                          {propertyName}
                        </h3>
                        <p className="text-[12.5px] text-charcoal-soft flex items-center gap-1">
                          <MapPin size={12} />
                          {propertyLocation}
                        </p>
                      </div>
                      
                      {/* Status Pills */}
                      <span className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md ${
                        status === 'Completed' ? 'bg-emerald-100 text-emerald-800' :
                        status === 'Confirmed' ? 'bg-blue-100 text-blue-800' :
                        status === 'Cancelled' ? 'bg-rose-100 text-rose-800' :
                        'bg-amber-100 text-amber-800'
                      }`}>
                        {status}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-line text-[13px] text-charcoal mt-1">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={14} className="text-forest" />
                        <span>{checkIn} to {checkOut}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Users size={14} className="text-forest" />
                        <span>{guests.adults} adults{guests.children > 0 && `, ${guests.children} kids`}</span>
                      </div>
                      <div className="flex items-center gap-1.5 font-bold text-forest-dark">
                        <span className="text-forest text-[14px]">₹</span>
                        <span>Total: ₹{totalAmount} Paid</span>
                      </div>
                    </div>
                  </div>

                  {/* Action items */}
                  <div className="w-full md:w-auto flex flex-col gap-2 md:self-stretch justify-center">
                    <span className="text-[10px] text-charcoal-soft font-mono uppercase tracking-wider block md:text-right">
                      ID: {id}
                    </span>
                    
                    {/* Cancellation Trigger */}
                    {activeTab === 'upcoming' && status !== 'Cancelled' && (
                      <button
                        onClick={() => handleCancelClick(id)}
                        className="py-2 px-4 border border-rose-200 text-rose-600 hover:bg-rose-50 font-semibold text-[12.5px] rounded-full transition-colors flex items-center justify-center gap-1.5 mt-2"
                      >
                        <XCircle size={14} />
                        Cancel Stay
                      </button>
                    )}

                    {/* Review Trigger */}
                    {activeTab === 'completed' && (
                      <Link
                        to={`/properties/${booking.propertyId}`}
                        className="py-2 px-4 bg-forest text-white hover:bg-forest-light font-semibold text-[12.5px] rounded-full transition-colors flex items-center justify-center gap-1.5 mt-2 text-center"
                      >
                        <Star size={13} className="fill-white" />
                        Write a Review
                      </Link>
                    )}
                  </div>

                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 px-4 bg-white border border-line rounded-2xl flex flex-col items-center">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-16 h-16 text-charcoal-soft opacity-30 mb-4">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
            <h3 className="font-fraunces text-xl font-semibold text-forest-dark mb-1">No {activeTab} bookings</h3>
            <p className="text-charcoal-soft text-[13.5px] max-w-sm mb-6">You don't have any bookings listed in this category right now.</p>
            <Link to="/properties" className="px-6 py-2.5 bg-forest text-white rounded-full font-semibold text-[13.5px]">
              Explore Stays
            </Link>
          </div>
        )}

      </main>

      {/* Cancellation Warning Dialog */}
      <Modal 
        isOpen={showCancelModal} 
        onClose={() => setShowCancelModal(false)}
        title="Cancel Stay"
      >
        <div className="flex flex-col gap-4 text-center items-center">
          <Info size={36} className="text-amber-500 mb-1" />
          <p className="text-[14.5px] text-charcoal leading-relaxed">
            Are you sure you want to cancel this booking stay? This action will set your status to cancelled and notify the host.
          </p>
          <div className="flex gap-4 w-full mt-4">
            <button 
              onClick={() => setShowCancelModal(false)}
              className="flex-1 py-2.5 border border-line font-semibold text-[13px] rounded-full hover:bg-cream"
            >
              No, Keep Booking
            </button>
            <button 
              onClick={confirmCancel}
              className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold text-[13px] rounded-full shadow-sm"
            >
              Yes, Cancel Stay
            </button>
          </div>
        </div>
      </Modal>

      <Footer />
    </div>
  );
}
