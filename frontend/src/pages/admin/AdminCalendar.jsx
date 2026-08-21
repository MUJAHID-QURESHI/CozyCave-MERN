import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Lock, Unlock, ChevronDown } from 'lucide-react';
import AdminSidebar from '../../components/layout/AdminSidebar';
import AdminNavbar from '../../components/layout/AdminNavbar';
import { blockPropertyDates, unblockPropertyDates } from '../../redux/slices/propertySlice';
import { addToast } from '../../redux/slices/uiSlice';
import api from '../../services/api';

export default function AdminCalendar() {
  const dispatch = useDispatch();
  const { properties } = useSelector((state) => state.properties);
  const { bookings } = useSelector((state) => state.bookings);

  // Selected property stay
  const [selectedPropId, setSelectedPropId] = useState(properties[0]?.id || '');
  const activeProperty = properties.find(p => p.id === selectedPropId);

  useEffect(() => {
    if (properties.length > 0 && !selectedPropId) {
      setSelectedPropId(properties[0].id);
    }
  }, [properties, selectedPropId]);

  // Focus Date: August 2026
  const [year, setYear] = useState(2026);
  const [month, setMonth] = useState(7); // 0-indexed (August)

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June', 
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Selected cell state for popup blocking
  const [activeDateCell, setActiveDateCell] = useState(null);
  
  // Custom price input state
  const [customPriceInput, setCustomPriceInput] = useState('');
  const [savingPrice, setSavingPrice] = useState(false);

  // Dropdown open state
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Availability state loaded from server
  const [availabilityList, setAvailabilityList] = useState([]);
  const [loadingAvail, setLoadingAvail] = useState(false);

  const fetchAvailability = async () => {
    if (!selectedPropId) return;
    setLoadingAvail(true);
    try {
      const response = await api.get(`/availability/${selectedPropId}`);
      setAvailabilityList(response.data.data);
    } catch (err) {
      console.error('Failed to fetch availability', err);
    } finally {
      setLoadingAvail(false);
    }
  };

  useEffect(() => {
    fetchAvailability();
  }, [selectedPropId]);

  // Set the price input when activeDateCell changes
  useEffect(() => {
    if (activeDateCell) {
      const record = availabilityList.find(a => a.date === activeDateCell);
      if (record && record.price) {
        setCustomPriceInput(record.price);
      } else if (activeProperty) {
        setCustomPriceInput(activeProperty.price || activeProperty.pricePerNight || '');
      }
    } else {
      setCustomPriceInput('');
    }
  }, [activeDateCell, availabilityList, activeProperty]);

  // Calendar generation helpers
  const getDaysInMonth = (y, m) => new Date(y, m + 1, 0).getDate();
  const getFirstDayOfMonth = (y, m) => new Date(y, m, 1).getDay();

  const totalDays = getDaysInMonth(year, month);
  const startDayIdx = getFirstDayOfMonth(year, month);

  const daysArray = [];
  // Padding cells
  for (let i = 0; i < startDayIdx; i++) {
    daysArray.push(null);
  }
  // Month cells
  for (let i = 1; i <= totalDays; i++) {
    daysArray.push(i);
  }

  // Double check dates status
  const getDateString = (day) => {
    if (!day) return '';
    const mStr = String(month + 1).padStart(2, '0');
    const dStr = String(day).padStart(2, '0');
    return `${year}-${mStr}-${dStr}`;
  };

  const getDayStatus = (day) => {
    if (!day) return 'empty';
    const dateStr = getDateString(day);

    // 1. Check from loaded availability list using string equality matching
    const record = availabilityList.find(a => a.date === dateStr);
    if (record) {
      if (record.status === 'blocked') return 'blocked';
      if (record.status === 'booked') return 'booked';
    }

    // 2. Check bookings
    const isBooked = bookings.some(b => {
      if (b.propertyId !== selectedPropId || b.status === 'Cancelled') return false;
      const start = new Date(b.checkIn);
      const end = new Date(b.checkOut);
      const current = new Date(dateStr);
      return current >= start && current < end;
    });

    if (isBooked) return 'booked';

    return 'available';
  };

  const getDayPrice = (day) => {
    if (!day || !activeProperty) return '';
    const dateStr = getDateString(day);
    const record = availabilityList.find(a => a.date === dateStr);
    if (record && record.price) {
      return record.price;
    }
    return activeProperty.price || activeProperty.pricePerNight;
  };

  const handleCellClick = (day) => {
    if (!day) return;
    const dateStr = getDateString(day);
    const status = getDayStatus(day);

    if (status === 'booked') {
      const activeBooking = bookings.find(b => {
        if (b.propertyId !== selectedPropId || b.status === 'Cancelled') return false;
        const start = new Date(b.checkIn);
        const end = new Date(b.checkOut);
        const current = new Date(dateStr);
        return current >= start && current < end;
      });

      if (activeBooking) {
        dispatch(addToast({ 
          message: `Stays booked by ${activeBooking.userName || 'Customer'} (${activeBooking.checkIn} to ${activeBooking.checkOut})`, 
          type: 'info' 
        }));
      }
      return;
    }

    setActiveDateCell(dateStr);
  };

  const handleBlockDate = async () => {
    if (!activeDateCell) return;
    dispatch(blockPropertyDates({ propertyId: selectedPropId, dates: [activeDateCell] }));
    dispatch(addToast({ message: `Blocked date: ${activeDateCell}`, type: 'success' }));
    // Refetch state
    setTimeout(fetchAvailability, 500);
    setActiveDateCell(null);
  };

  const handleUnblockDate = async () => {
    if (!activeDateCell) return;
    dispatch(unblockPropertyDates({ propertyId: selectedPropId, date: activeDateCell }));
    dispatch(addToast({ message: `Unblocked date: ${activeDateCell}`, type: 'success' }));
    // Refetch state
    setTimeout(fetchAvailability, 500);
    setActiveDateCell(null);
  };

  const handleSaveCustomPrice = async (e) => {
    e.preventDefault();
    if (!activeDateCell || !selectedPropId) return;

    setSavingPrice(true);
    try {
      const priceVal = customPriceInput ? parseFloat(customPriceInput) : null;
      const response = await api.post('/availability/price', {
        propertyId: selectedPropId,
        date: activeDateCell,
        price: priceVal
      });

      if (response.data.success) {
        dispatch(addToast({ 
          message: priceVal ? `Custom price set to ₹${priceVal} for ${activeDateCell}` : `Reset to base price for ${activeDateCell}`, 
          type: 'success' 
        }));
        fetchAvailability();
        setActiveDateCell(null);
      }
    } catch (err) {
      dispatch(addToast({ 
        message: err.response?.data?.message || 'Failed to update price', 
        type: 'error' 
      }));
    } finally {
      setSavingPrice(false);
    }
  };

  const handlePrevMonth = () => {
    if (month === 0) {
      setMonth(11);
      setYear(year - 1);
    } else {
      setMonth(month - 1);
    }
  };

  const handleNextMonth = () => {
    if (month === 11) {
      setMonth(0);
      setYear(year + 1);
    } else {
      setMonth(month + 1);
    }
  };

  return (
    <div className="min-h-screen bg-cream/30 flex">
      <AdminSidebar />

      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen">
        <AdminNavbar />

        <main className="flex-1 p-6 md:p-8 space-y-6 max-w-[1000px] mx-auto w-full">
          
          {/* Top selection row */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-line">
            <div>
              <p className="text-[13.5px] text-charcoal-soft font-medium">Configure dates blocks or set custom daily prices</p>
            </div>
            
            <div className="flex items-center gap-2">
              <label className="text-[12px] font-bold text-charcoal-soft uppercase tracking-wider">Stay Cabin:</label>
              
              {/* Aesthetic Custom Dropdown Picker */}
              <div className="relative">
                <button 
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="bg-white border border-line rounded-xl py-2.5 px-4 text-[13.5px] font-semibold text-forest-dark flex items-center gap-2 hover:bg-cream-deep/15 transition-all shadow-sm focus:outline-none"
                >
                  <span>{activeProperty?.name || 'Select Stay Cabin'}</span>
                  <ChevronDown size={14} className="text-charcoal-soft" />
                </button>

                {dropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-30" onClick={() => setDropdownOpen(false)} />
                    <div className="absolute right-0 mt-2 w-64 bg-white border border-line rounded-2xl shadow-xl z-40 py-2 overflow-hidden anim-scale-in origin-top-right">
                      {properties.map(p => {
                        const isSelected = p.id === selectedPropId;
                        return (
                          <button
                            key={p.id}
                            onClick={() => {
                              setSelectedPropId(p.id);
                              setDropdownOpen(false);
                            }}
                            className={`w-full text-left px-4 py-2.5 text-[13.5px] transition-colors flex items-center justify-between ${
                              isSelected 
                                ? 'bg-forest text-white font-bold' 
                                : 'text-charcoal hover:bg-cream/25 hover:text-forest'
                            }`}
                          >
                            <span>{p.name}</span>
                            {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-gold" />}
                          </button>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Calendar Box Container */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            
            {/* Left: The calendar grid (2 grid cols) */}
            <div className="md:col-span-2 bg-white border border-line rounded-2xl shadow-sm p-6">
              {/* Header month toggle */}
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-fraunces text-[17px] font-semibold text-forest-dark">
                  {monthNames[month]} {year}
                </h3>
                <div className="flex gap-2">
                  <button 
                    onClick={handlePrevMonth}
                    className="p-2 border border-line hover:bg-cream/45 rounded-lg text-charcoal"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button 
                    onClick={handleNextMonth}
                    className="p-2 border border-line hover:bg-cream/45 rounded-lg text-charcoal"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>

              {/* Day Labels */}
              <div className="grid grid-cols-7 text-center font-bold text-[11px] text-charcoal-soft uppercase tracking-wider mb-3">
                <span>Sun</span>
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
                <span>Sat</span>
              </div>

              {/* Day Cells Grid */}
              <div className="grid grid-cols-7 gap-2">
                {daysArray.map((day, idx) => {
                  const status = getDayStatus(day);
                  const priceVal = getDayPrice(day);
                  const isCellActive = day && activeDateCell === getDateString(day);

                  let cellColor = 'bg-cream/10 border-transparent text-charcoal';
                  if (status === 'blocked') cellColor = 'bg-rose-50 text-rose-800 border-rose-200 hover:bg-rose-100 font-semibold';
                  if (status === 'booked') cellColor = 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100 font-semibold cursor-help';
                  if (status === 'available') cellColor = 'bg-emerald-50 text-emerald-800 border-emerald-100 hover:border-emerald-300 hover:bg-emerald-100/50';

                  // Custom visual indicator if it has a custom price override
                  const isCustomPrice = day && availabilityList.some(a => a.date === getDateString(day) && a.price);

                  return (
                    <div 
                      key={idx}
                      onClick={() => handleCellClick(day)}
                      className={`h-14 border rounded-lg flex flex-col justify-center items-center text-[13.5px] cursor-pointer transition-all ${
                        isCellActive ? 'ring-2 ring-gold border-gold' : ''
                      } ${cellColor} ${!day ? 'pointer-events-none opacity-0' : ''}`}
                    >
                      <span className="font-semibold text-[13px] leading-tight">{day}</span>
                      {day && (
                        <span className={`text-[10px] mt-0.5 leading-none font-bold ${
                          status === 'blocked' ? 'text-rose-500' : 
                          status === 'booked' ? 'text-amber-600' : 
                          isCustomPrice ? 'text-gold' : 'text-forest'
                        }`}>
                          ₹{priceVal}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right: Date cell detail & controls (1 grid col) */}
            <div className="bg-white border border-line rounded-2xl shadow-sm p-6 flex flex-col gap-5">
              <h3 className="font-fraunces text-md font-semibold text-forest-dark border-b border-line pb-3">
                Calendar Controls
              </h3>

              {activeDateCell ? (
                <div className="flex flex-col gap-5 text-[13.5px]">
                  <div>
                    <span className="text-[11px] font-bold text-charcoal-soft uppercase tracking-wider block">Selected Date</span>
                    <span className="text-[14.5px] font-bold text-forest-dark mt-0.5 block">{activeDateCell}</span>
                  </div>

                  {/* Pricing Rate Section */}
                  <form onSubmit={handleSaveCustomPrice} className="border-t border-b border-line py-4 flex flex-col gap-2.5">
                    <label className="text-[11px] font-bold text-charcoal-soft uppercase tracking-wider block">Set Daily Rate (₹)</label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <span className="absolute left-3 top-2.5 text-[14.5px] font-bold text-charcoal-soft leading-none">₹</span>
                        <input 
                          type="number" 
                          placeholder="Base rate"
                          value={customPriceInput}
                          onChange={(e) => setCustomPriceInput(e.target.value)}
                          className="w-full bg-cream/30 border border-line rounded-xl py-2.5 pl-8 pr-3 text-[13.5px] text-forest-dark font-medium focus:outline-none"
                        />
                      </div>
                      <button 
                        type="submit"
                        disabled={savingPrice}
                        className="py-2.5 px-4 bg-gold hover:bg-gold-light text-forest-dark font-bold text-xs rounded-xl shadow-sm flex items-center justify-center transition-colors disabled:opacity-50"
                      >
                        {savingPrice ? 'Saving...' : 'Apply'}
                      </button>
                    </div>
                    <button 
                      type="button"
                      onClick={() => {
                        setCustomPriceInput('');
                        setTimeout(() => {
                          handleSaveCustomPrice({ preventDefault: () => {} });
                        }, 50);
                      }}
                      className="text-[11px] font-bold text-forest hover:underline text-left self-start mt-0.5"
                    >
                      Reset to base price
                    </button>
                  </form>

                  {/* Occupancy Blocking Actions */}
                  <div>
                    <span className="text-[11px] font-bold text-charcoal-soft uppercase tracking-wider block mb-2">Block Occupancy</span>
                    {activeProperty?.blockedDates && activeProperty.blockedDates.includes(activeDateCell) ? (
                      <button
                        onClick={handleUnblockDate}
                        className="w-full py-3 bg-forest hover:bg-forest-light text-white font-semibold rounded-xl text-center shadow-sm flex items-center justify-center gap-1.5 transition-all text-xs"
                      >
                        <Unlock size={14} />
                        Unblock Date
                      </button>
                    ) : (
                      <button
                        onClick={handleBlockDate}
                        className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl text-center shadow-sm flex items-center justify-center gap-1.5 transition-all text-xs"
                      >
                        <Lock size={14} />
                        Block Date
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-charcoal-soft text-[13px] leading-relaxed">
                  <CalendarIcon size={24} className="mx-auto mb-2 text-charcoal-soft opacity-30" />
                  Select any available or blocked cell date in the grid to manage rates and occupancy blocks.
                </div>
              )}

              {/* Status color guide legend */}
              <div className="pt-4 border-t border-line mt-2 space-y-2.5 text-[12px] text-charcoal-soft font-semibold">
                <div className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 bg-emerald-50 border border-emerald-100 rounded-md block" />
                  <span>Available Date</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 bg-amber-50 border border-amber-200 rounded-md block" />
                  <span>Booked Stay (View Host info)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 bg-rose-50 border border-rose-200 rounded-md block" />
                  <span>Blocked Stays (Admin Locked)</span>
                </div>
              </div>

            </div>

          </div>

        </main>
      </div>
    </div>
  );
}
