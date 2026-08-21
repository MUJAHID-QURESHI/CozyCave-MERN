import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { SlidersHorizontal, ArrowUpDown, X, Search, ChevronDown } from 'lucide-react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import PropertyCard from '../../components/property/PropertyCard';
import SearchBar from '../../components/booking/SearchBar';
import { updateFilters, fetchProperties } from '../../redux/slices/propertySlice';
import { mockAmenities } from '../../data/mockData';

const CustomSelect = ({ value, onChange, options, icon: Icon, inline }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find(o => o.value === value) || options[0];

  const handleSelect = (val) => {
    onChange({ target: { value: val } });
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClose = () => setIsOpen(false);
    window.addEventListener('click', handleClose);
    return () => window.removeEventListener('click', handleClose);
  }, []);

  return (
    <div className="relative w-full" onClick={e => e.stopPropagation()}>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={
          inline
            ? "flex items-center gap-1.5 bg-transparent text-[13px] font-semibold text-forest-dark cursor-pointer select-none py-1 border-none outline-none"
            : "w-full bg-white border border-line rounded-xl py-3.5 px-4 text-[13.5px] font-semibold text-forest-dark flex items-center justify-between cursor-pointer hover:border-forest hover:bg-cream-deep/10 transition-all select-none shadow-cozy-sm"
        }
      >
        <div className="flex items-center gap-2">
          {Icon && <Icon size={15} className="text-forest-light" />}
          <span>{selectedOption.label}</span>
        </div>
        <ChevronDown size={13} className={`text-charcoal-soft transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {isOpen && (
        <div className={`absolute left-0 right-0 mt-2 bg-white border border-line rounded-xl shadow-lg overflow-hidden z-30 flex flex-col anim-scale-in origin-top ${inline ? 'w-48 top-full' : 'top-full'}`}>
          {options.map((opt) => (
            <div
              key={opt.value}
              onClick={() => handleSelect(opt.value)}
              className={`py-3 px-4 text-[13.5px] font-semibold cursor-pointer transition-colors ${
                opt.value === value 
                  ? 'bg-forest text-white' 
                  : 'text-forest-dark hover:bg-cream-deep/40'
              }`}
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const guestOptions = [
  { value: 1, label: '1+ Guests' },
  { value: 2, label: '2+ Guests' },
  { value: 4, label: '4+ Guests' },
  { value: 6, label: '6+ Guests' },
  { value: 8, label: '8+ Guests' },
];

const sortOptions = [
  { value: 'rating-desc', label: 'Sort: Highest Rated' },
  { value: 'price-asc', label: 'Sort: Price: Low to High' },
  { value: 'price-desc', label: 'Sort: Price: High to Low' },
];

export default function Properties() {
  const dispatch = useDispatch();
  const { filteredProperties, filters } = useSelector((state) => state.properties);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [priceInput, setPriceInput] = useState(filters.priceRange[1]);

  useEffect(() => {
    dispatch(fetchProperties(filters));
  }, [dispatch, filters]);

  const handlePriceChange = (e) => {
    const val = parseInt(e.target.value);
    setPriceInput(val);
    dispatch(updateFilters({
      priceRange: [filters.priceRange[0], val]
    }));
  };

  const handleGuestChange = (e) => {
    dispatch(updateFilters({
      guests: parseInt(e.target.value) || 1
    }));
  };

  const handleSortChange = (e) => {
    dispatch(updateFilters({
      sortBy: e.target.value
    }));
  };

  const handleAmenityToggle = (amenityName) => {
    let updatedAmenities = [...filters.amenities];
    if (updatedAmenities.includes(amenityName)) {
      updatedAmenities = updatedAmenities.filter(a => a !== amenityName);
    } else {
      updatedAmenities.push(amenityName);
    }
    dispatch(updateFilters({
      amenities: updatedAmenities
    }));
  };

  const resetFilters = () => {
    setPriceInput(1000);
    dispatch(updateFilters({
      location: '',
      priceRange: [0, 1000],
      guests: 1,
      amenities: [],
      sortBy: 'rating-desc',
    }));
  };

  const FiltersContent = () => (
    <div className="flex flex-col gap-7 bg-white p-6 rounded-2xl border border-line">
      <div className="flex justify-between items-center pb-4 border-b border-line">
        <h3 className="font-fraunces text-lg font-semibold text-forest-dark">Filters</h3>
        <button 
          onClick={resetFilters}
          className="text-[12.5px] font-semibold text-forest-light hover:underline"
        >
          Reset All
        </button>
      </div>

      {/* Price Slider */}
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <label className="text-[11.5px] font-bold text-charcoal uppercase tracking-wider">Max Price per night</label>
          <span className="text-[13.5px] font-semibold text-forest-dark">₹{priceInput}</span>
        </div>
        <input 
          type="range" 
          min="50" 
          max="1000" 
          step="25"
          value={priceInput}
          onChange={handlePriceChange}
          className="w-full h-1.5 bg-cream border border-line rounded-lg appearance-none cursor-pointer accent-forest"
        />
        <div className="flex justify-between text-[11px] text-charcoal-soft font-medium">
          <span>₹50</span>
          <span>₹1000+</span>
        </div>
      </div>

      {/* Guests Dropdown */}
      <div className="flex flex-col gap-2">
        <label className="text-[11.5px] font-bold text-charcoal uppercase tracking-wider">Minimum Guest Capacity</label>
        <CustomSelect 
          value={filters.guests} 
          onChange={handleGuestChange} 
          options={guestOptions} 
        />
      </div>

      {/* Amenities List */}
      <div className="flex flex-col gap-3">
        <label className="text-[11.5px] font-bold text-charcoal uppercase tracking-wider">Amenities</label>
        <div className="flex flex-col gap-2.5">
          {mockAmenities.map((amenity) => {
            const checked = filters.amenities.includes(amenity.name);
            return (
              <label 
                key={amenity.id} 
                className="flex items-center gap-3 text-[13.5px] text-charcoal cursor-pointer select-none"
              >
                <input 
                  type="checkbox" 
                  checked={checked}
                  onChange={() => handleAmenityToggle(amenity.name)}
                  className="w-4 h-4 rounded border-line text-forest focus:ring-forest cursor-pointer"
                />
                <span className={checked ? 'font-medium text-forest-dark' : ''}>{amenity.name}</span>
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* Hero section */}
      <div className="bg-forest py-12 px-6 text-center text-white relative">
        <h2 className="font-fraunces text-3xl md:text-4xl text-white mb-2 font-medium">
          Find Your Next Adventure
        </h2>
        <p className="text-cream/80 text-[14px] md:text-[15px] font-inter max-w-md mx-auto">
          Browse our handpicked collections of luxury cabins, beachfront cottages, and scenic villas.
        </p>
      </div>

      {/* Search Bar section */}
      <div className="mt-[-25px] relative z-20">
        <SearchBar inline={true} />
      </div>

      {/* Main Container */}
      <main className="flex-1 max-w-[1240px] mx-auto w-full px-6 md:px-12 py-12">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Left Side: Desktop Filters */}
          <aside className="w-full lg:w-[280px] flex-shrink-0 hidden lg:block">
            <FiltersContent />
          </aside>

          {/* Right Side: Properties grid & Top controls */}
          <div className="flex-1 w-full">
            
            {/* Top controls: count, sort, mobile filter toggle */}
            <div className="flex items-center justify-between gap-4 mb-8 bg-white p-4 rounded-xl border border-line">
              <span className="text-[13.5px] font-semibold text-charcoal">
                Showing <strong className="text-forest">{filteredProperties.length}</strong> properties
              </span>

              <div className="flex items-center gap-3">
                {/* Mobile Filter Toggle */}
                <button 
                  onClick={() => setMobileFiltersOpen(true)}
                  className="lg:hidden flex items-center gap-1.5 px-3 py-2 border border-line rounded-lg text-[13px] font-semibold text-charcoal hover:bg-cream"
                >
                  <SlidersHorizontal size={14} />
                  Filters
                </button>

                {/* Sort Dropdown */}
                <div className="flex items-center gap-1.5">
                  <ArrowUpDown size={14} className="text-charcoal-soft hidden sm:block" />
                  <CustomSelect 
                    value={filters.sortBy} 
                    onChange={handleSortChange} 
                    options={sortOptions} 
                    inline={true} 
                  />
                </div>
              </div>
            </div>

            {/* Properties Grid */}
            {filteredProperties.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
                {filteredProperties.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 px-4 bg-white border border-line rounded-2xl flex flex-col items-center">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-16 h-16 text-charcoal-soft opacity-30 mb-4">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <path d="M9 22V12h6v10" />
                </svg>
                <h3 className="font-fraunces text-xl font-semibold text-forest-dark mb-1">
                  No properties found
                </h3>
                <p className="text-charcoal-soft text-[13.5px] max-w-sm mb-6">
                  Try adjusting your filter options or clearing your search criteria to find matching stays.
                </p>
                <button 
                  onClick={resetFilters}
                  className="px-6 py-2.5 bg-forest text-white rounded-full font-semibold text-[13.5px]"
                >
                  Clear All Filters
                </button>
              </div>
            )}

          </div>
        </div>
      </main>

      {/* Mobile Filters Modal */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 flex justify-end lg:hidden">
          <div 
            onClick={() => setMobileFiltersOpen(false)}
            className="fixed inset-0 bg-forest-dark/40 backdrop-blur-sm"
          />
          <div className="relative w-full max-w-xs bg-white h-full overflow-y-auto p-6 flex flex-col shadow-2xl anim-fade-up">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-fraunces text-lg font-semibold text-forest-dark">Filters</h3>
              <button 
                onClick={() => setMobileFiltersOpen(false)}
                className="p-1.5 rounded-full text-charcoal hover:bg-cream-deep"
              >
                <X size={18} />
              </button>
            </div>
            <FiltersContent />
            <button 
              onClick={() => setMobileFiltersOpen(false)}
              className="mt-6 w-full py-3 bg-forest text-white font-semibold rounded-xl text-[14px]"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
