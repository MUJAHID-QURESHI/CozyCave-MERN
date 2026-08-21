import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Calendar, Users, ChevronDown } from 'lucide-react';
import { updateSearchParams, updateFilters } from '../../redux/slices/propertySlice';

export default function SearchBar({ inline = false }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const searchParams = useSelector((state) => state.properties.searchParams);

  const [checkIn, setCheckIn] = useState(searchParams.checkIn);
  const [checkOut, setCheckOut] = useState(searchParams.checkOut);
  const [showGuestDropdown, setShowGuestDropdown] = useState(false);
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);

  const handleSearch = (e) => {
    e.preventDefault();

    // Update search parameters in Redux (default to Indore)
    dispatch(updateSearchParams({
      location: 'Indore',
      checkIn,
      checkOut,
      guests: adults + children
    }));

    // Also set filters in Redux so the Properties page picks them up instantly
    dispatch(updateFilters({
      location: 'Indore',
      guests: adults + children
    }));

    navigate('/properties');
  };

  return (
    <div className={`w-full max-w-[1240px] mx-auto px-6 md:px-12 ${inline ? '' : '-mt-10 relative z-30'}`}>
      <form 
        onSubmit={handleSearch}
        className="bg-white border border-line rounded-2xl md:rounded-[20px] shadow-cozy p-3.5 flex flex-col md:flex-row gap-2 items-stretch"
      >

        {/* Field: Check-in */}
        <div className="flex-1 flex flex-col justify-center px-5 py-3 border-b md:border-b-0 md:border-r border-line">
          <label className="text-[11px] font-bold text-charcoal-soft uppercase tracking-[0.08em] mb-1.5 flex items-center gap-1.5">
            <Calendar size={12} className="text-forest" />
            Check-in
          </label>
          <input 
            type="date"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            className="w-full bg-transparent font-inter text-[15px] font-semibold text-forest-dark focus:outline-none cursor-pointer"
          />
        </div>

        {/* Field: Check-out */}
        <div className="flex-1 flex flex-col justify-center px-5 py-3 border-b md:border-b-0 md:border-r border-line">
          <label className="text-[11px] font-bold text-charcoal-soft uppercase tracking-[0.08em] mb-1.5 flex items-center gap-1.5">
            <Calendar size={12} className="text-forest" />
            Check-out
          </label>
          <input 
            type="date"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            min={checkIn || new Date().toISOString().split('T')[0]}
            className="w-full bg-transparent font-inter text-[15px] font-semibold text-forest-dark focus:outline-none cursor-pointer"
          />
        </div>

        {/* Field: Guests */}
        <div className="flex-1 flex flex-col justify-center px-5 py-3 relative border-b md:border-b-0 md:border-r-0 border-line">
          <div 
            onClick={() => setShowGuestDropdown(!showGuestDropdown)}
            className="cursor-pointer select-none"
          >
            <label className="text-[11px] font-bold text-charcoal-soft uppercase tracking-[0.08em] mb-1.5 flex items-center gap-1.5">
              <Users size={12} className="text-forest" />
              Guests
            </label>
            <div className="flex justify-between items-center pr-2">
              <div className="font-inter text-[15px] font-semibold text-forest-dark">
                {adults + children} guests
              </div>
              <ChevronDown size={14} className="text-charcoal-soft" />
            </div>
          </div>

          {/* Guest Selector Dropdown */}
          {showGuestDropdown && (
            <div className="absolute top-full left-0 right-0 mt-3 bg-white border border-line rounded-xl shadow-lg p-5 z-20 flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-inter text-[14px] font-semibold text-forest-dark">Adults</h4>
                  <p className="text-[12px] text-charcoal-soft font-normal">Ages 13 or above</p>
                </div>
                <div className="flex items-center gap-3.5">
                  <button 
                    type="button"
                    onClick={() => setAdults(Math.max(1, adults - 1))}
                    className="w-8 h-8 rounded-full border border-line flex items-center justify-center font-bold text-forest hover:bg-cream transition-colors text-sm"
                  >
                    -
                  </button>
                  <span className="font-semibold text-forest text-sm w-4 text-center">{adults}</span>
                  <button 
                    type="button"
                    onClick={() => setAdults(adults + 1)}
                    className="w-8 h-8 rounded-full border border-line flex items-center justify-center font-bold text-forest hover:bg-cream transition-colors text-sm"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-inter text-[14px] font-semibold text-forest-dark">Children</h4>
                  <p className="text-[12px] text-charcoal-soft font-normal">Ages 2 to 12</p>
                </div>
                <div className="flex items-center gap-3.5">
                  <button 
                    type="button"
                    onClick={() => setChildren(Math.max(0, children - 1))}
                    className="w-8 h-8 rounded-full border border-line flex items-center justify-center font-bold text-forest hover:bg-cream transition-colors text-sm"
                  >
                    -
                  </button>
                  <span className="font-semibold text-forest text-sm w-4 text-center">{children}</span>
                  <button 
                    type="button"
                    onClick={() => setChildren(children + 1)}
                    className="w-8 h-8 rounded-full border border-line flex items-center justify-center font-bold text-forest hover:bg-cream transition-colors text-sm"
                  >
                    +
                  </button>
                </div>
              </div>

              <button 
                type="button"
                onClick={() => setShowGuestDropdown(false)}
                className="w-full py-2 bg-cream text-forest-dark font-semibold text-[13px] rounded-lg hover:bg-cream-deep transition-colors text-center"
              >
                Apply
              </button>
            </div>
          )}
        </div>

        {/* Search button */}
        <button 
          type="submit"
          className="search-btn bg-forest text-white rounded-xl py-4.5 px-8 flex items-center justify-center gap-2 font-semibold text-[15px] shadow-sm hover:translate-y-[-2px] hover:shadow-[0_12px_22px_-8px_rgba(8,69,62,0.55)] transition-all duration-200"
        >
          <Search size={16} className="stroke-[2.2]" />
          <span>Search</span>
        </button>
      </form>
    </div>
  );
}
