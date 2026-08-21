import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { ArrowLeft, Save, Plus, Trash2, ChevronDown } from 'lucide-react';
import AdminSidebar from '../../components/layout/AdminSidebar';
import AdminNavbar from '../../components/layout/AdminNavbar';
import { addProperty, editProperty } from '../../redux/slices/propertySlice';
import { addToast } from '../../redux/slices/uiSlice';
import { mockAmenities } from '../../data/mockData';
import api from '../../services/api';

export default function AddEditProperty() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { properties } = useSelector((state) => state.properties);

  const isEditMode = !!id;

  // Form Fields State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [stateName, setStateName] = useState('');
  const [price, setPrice] = useState(250);
  const [capacity, setCapacity] = useState(4);
  const [bedrooms, setBedrooms] = useState(2);
  const [beds, setBeds] = useState(2);
  const [bathrooms, setBathrooms] = useState(2);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [rulesInput, setRulesInput] = useState('');
  const [checkInTime, setCheckInTime] = useState('03:00 PM');
  const [checkOutTime, setCheckOutTime] = useState('11:00 AM');
  const [cancellationPolicy, setCancellationPolicy] = useState('Flexible cancellation.');
  const [tag, setTag] = useState('Popular');
  const [showTagDropdown, setShowTagDropdown] = useState(false);
  const tagOptions = [
    { value: '', label: 'None (Standard)', color: 'text-charcoal bg-gray-50 border-gray-200' },
    { value: 'Superhost', label: 'Superhost', color: 'text-amber-700 bg-amber-50 border-amber-200' },
    { value: 'Popular', label: 'Popular', color: 'text-forest bg-forest/5 border-forest/20' },
    { value: 'New', label: 'New', color: 'text-blue-700 bg-blue-50 border-blue-200' },
  ];
  // Google Map Url
  const [googleMapUrl, setGoogleMapUrl] = useState('');
  // Image upload state
  const [isUploading, setIsUploading] = useState(false);
  const [imageUrlsList, setImageUrlsList] = useState([]);

  useEffect(() => {
    if (isEditMode) {
      const match = properties.find((p) => p.id === id);
      if (match) {
        setName(match.name || '');
        setDescription(match.description || '');
        setAddress(match.address || '');
        setCity(match.city || '');
        setStateName(match.state || '');
        setPrice(match.price || 250);
        setCapacity(match.capacity || 4);
        setBedrooms(match.bedrooms || 2);
        setBeds(match.beds || 2);
        setBathrooms(match.bathrooms || 2);
        setSelectedAmenities(match.amenities || []);
        setRulesInput(match.houseRules ? match.houseRules.join('\n') : '');
        setGoogleMapUrl(match.googleMapUrl || '');
        setCheckInTime(match.checkInTime || '03:00 PM');
        setCheckOutTime(match.checkOutTime || '11:00 AM');
        setCancellationPolicy(match.cancellationPolicy || 'Flexible cancellation.');
        setTag(match.tag || 'Popular');
        setImageUrlsList(match.images || []);
      }
    }
  }, [id, isEditMode, properties]);

  const handleAmenityToggle = (name) => {
    if (selectedAmenities.includes(name)) {
      setSelectedAmenities(selectedAmenities.filter(a => a !== name));
    } else {
      setSelectedAmenities([...selectedAmenities, name]);
    }
  };

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    if (files.length + imageUrlsList.length > 8) {
      dispatch(addToast({ message: 'Maximum 8 photos allowed per property stay', type: 'warning' }));
      return;
    }

    const formData = new FormData();
    files.forEach(file => {
      formData.append('images', file);
    });

    setIsUploading(true);
    dispatch(addToast({ message: 'Uploading stay photos...', type: 'info' }));

    try {
      const response = await api.post('/upload/property-images', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data?.success) {
        const uploadedUrls = response.data.data;
        setImageUrlsList([...imageUrlsList, ...uploadedUrls]);
        dispatch(addToast({ message: 'Photos uploaded successfully!', type: 'success' }));
      }
    } catch (err) {
      dispatch(addToast({ 
        message: err.response?.data?.message || 'Failed to upload photos. Please try again.', 
        type: 'error' 
      }));
    } finally {
      setIsUploading(false);
      e.target.value = null;
    }
  };

  const handleRemoveImageUrl = (idx) => {
    setImageUrlsList(imageUrlsList.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim() || !city.trim() || !stateName.trim() || !description.trim()) {
      dispatch(addToast({ message: 'Name, city, state and description are required fields', type: 'warning' }));
      return;
    }

    const payload = {
      name,
      description,
      address,
      city,
      state: stateName,
      price: parseInt(price) || 100,
      capacity: parseInt(capacity) || 2,
      bedrooms: parseInt(bedrooms) || 1,
      beds: parseInt(beds) || 1,
      bathrooms: parseFloat(bathrooms) || 1,
      amenities: selectedAmenities,
      houseRules: rulesInput.split('\n').filter(r => r.trim() !== ''),
      googleMapUrl,
      checkInTime,
      checkOutTime,
      cancellationPolicy,
      tag,
      images: imageUrlsList.length > 0 ? imageUrlsList : [
        'https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=600&q=80'
      ]
    };

    try {
      if (isEditMode) {
        await dispatch(editProperty({ id, ...payload })).unwrap();
        dispatch(addToast({ message: `${name} has been edited successfully!`, type: 'success' }));
      } else {
        await dispatch(addProperty(payload)).unwrap();
        dispatch(addToast({ message: `${name} has been created successfully!`, type: 'success' }));
      }
      navigate('/admin/properties');
    } catch (err) {
      dispatch(addToast({ message: err || 'Action failed. Please check inputs and try again.', type: 'error' }));
    }
  };

  return (
    <div className="min-h-screen bg-cream/30 flex">
      <AdminSidebar />

      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen">
        <AdminNavbar />

        <main className="flex-1 p-6 md:p-8 space-y-6 max-w-[900px] mx-auto w-full">
          {/* Back button */}
          <div>
            <Link 
              to="/admin/properties"
              className="flex items-center gap-1 text-[13px] font-semibold text-forest hover:underline"
            >
              <ArrowLeft size={14} />
              Back to Properties list
            </Link>
          </div>

          {/* Form Card */}
          <div className="bg-white border border-line rounded-2xl shadow-sm p-6 sm:p-8">
            <h3 className="font-fraunces text-xl font-semibold text-forest-dark mb-6 border-b border-line pb-4">
              {isEditMode ? 'Edit Property Stay Details' : 'Add New Property Stay'}
            </h3>

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              
              {/* Row: Name and Tag */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2 flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-charcoal uppercase tracking-wider">Property Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Whispering Pines Cabin"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-cream/30 border border-line rounded-xl py-2.5 px-4 text-[13.5px] text-forest-dark font-medium focus:outline-none focus:border-forest-light"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-charcoal uppercase tracking-wider">Highlight Tag</label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowTagDropdown(!showTagDropdown)}
                      className="w-full bg-cream/30 border border-line rounded-xl py-2.5 px-4 text-[13.5px] text-forest-dark font-medium focus:outline-none focus:border-forest-light cursor-pointer flex justify-between items-center min-h-[44px]"
                    >
                      <span>
                        {tag ? (
                          <span className={`px-3 py-1 rounded-full text-[11px] font-bold border ${
                            tag === 'Superhost' ? 'text-amber-700 bg-amber-50 border-amber-200' :
                            tag === 'Popular' ? 'text-forest bg-forest/5 border-forest/20' :
                            'text-blue-700 bg-blue-50 border-blue-200'
                          }`}>
                            {tag}
                          </span>
                        ) : (
                          <span className="text-charcoal-soft font-semibold">None (Standard)</span>
                        )}
                      </span>
                      <ChevronDown size={14} className="text-charcoal-soft" />
                    </button>

                    {showTagDropdown && (
                      <>
                        <div className="fixed inset-0 z-30" onClick={() => setShowTagDropdown(false)} />
                        <div className="absolute right-0 mt-1.5 w-full bg-white border border-line rounded-2xl shadow-xl z-40 py-1.5 overflow-hidden animate-fade-in origin-top">
                          {tagOptions.map((opt) => {
                            const isSelected = tag === opt.value;
                            return (
                              <button
                                key={opt.value}
                                type="button"
                                onClick={() => {
                                  setTag(opt.value);
                                  setShowTagDropdown(false);
                                }}
                                className={`w-full text-left px-4 py-2.5 text-[13px] transition-colors flex items-center justify-between hover:bg-cream/20 ${
                                  isSelected ? 'bg-cream-deep/20 font-bold text-forest' : 'text-charcoal'
                                }`}
                              >
                                <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${opt.color}`}>
                                  {opt.label}
                                </span>
                                {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-forest" />}
                              </button>
                            );
                          })}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Row: Address details */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-charcoal uppercase tracking-wider">Street Address</label>
                  <input 
                    type="text" 
                    placeholder="284 Pines Trail"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full bg-cream/30 border border-line rounded-xl py-2.5 px-4 text-[13.5px] text-forest-dark font-medium focus:outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-charcoal uppercase tracking-wider">City</label>
                  <input 
                    type="text" 
                    placeholder="Asheville"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-cream/30 border border-line rounded-xl py-2.5 px-4 text-[13.5px] text-forest-dark font-medium focus:outline-none"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-charcoal uppercase tracking-wider">State / Region</label>
                  <input 
                    type="text" 
                    placeholder="North Carolina"
                    value={stateName}
                    onChange={(e) => setStateName(e.target.value)}
                    className="w-full bg-cream/30 border border-line rounded-xl py-2.5 px-4 text-[13.5px] text-forest-dark font-medium focus:outline-none"
                    required
                  />
                </div>
              </div>

              {/* Row: Description */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-charcoal uppercase tracking-wider">Description</label>
                <textarea 
                  rows="4"
                  placeholder="Detail the property layout, views, highlights..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-cream/30 border border-line rounded-xl py-2.5 px-4 text-[13.5px] text-forest-dark font-medium focus:outline-none focus:border-forest-light"
                  required
                />
              </div>

              {/* Row: Pricing and Capacity */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-charcoal uppercase tracking-wider">Price/Night (₹)</label>
                  <input 
                    type="number" 
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full bg-cream/30 border border-line rounded-xl py-2.5 px-4 text-[13.5px] text-forest-dark font-medium focus:outline-none"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-charcoal uppercase tracking-wider">Guests Limit</label>
                  <input 
                    type="number" 
                    value={capacity}
                    onChange={(e) => setCapacity(e.target.value)}
                    className="w-full bg-cream/30 border border-line rounded-xl py-2.5 px-4 text-[13.5px] text-forest-dark font-medium focus:outline-none"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-charcoal uppercase tracking-wider">Bedrooms</label>
                  <input 
                    type="number" 
                    value={bedrooms}
                    onChange={(e) => setBedrooms(e.target.value)}
                    className="w-full bg-cream/30 border border-line rounded-xl py-2.5 px-4 text-[13.5px] text-forest-dark font-medium focus:outline-none"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-charcoal uppercase tracking-wider">Beds</label>
                  <input 
                    type="number" 
                    value={beds}
                    onChange={(e) => setBeds(e.target.value)}
                    className="w-full bg-cream/30 border border-line rounded-xl py-2.5 px-4 text-[13.5px] text-forest-dark font-medium focus:outline-none"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-charcoal uppercase tracking-wider">Bathrooms</label>
                  <input 
                    type="number" 
                    step="0.5"
                    value={bathrooms}
                    onChange={(e) => setBathrooms(e.target.value)}
                    className="w-full bg-cream/30 border border-line rounded-xl py-2.5 px-4 text-[13.5px] text-forest-dark font-medium focus:outline-none"
                    required
                  />
                </div>
              </div>

              {/* Row: Timings and Cancellation Policy */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-charcoal uppercase tracking-wider">Check-in Time</label>
                  <input 
                    type="text" 
                    placeholder="03:00 PM"
                    value={checkInTime}
                    onChange={(e) => setCheckInTime(e.target.value)}
                    className="w-full bg-cream/30 border border-line rounded-xl py-2.5 px-4 text-[13.5px] text-forest-dark font-medium focus:outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-charcoal uppercase tracking-wider">Checkout Time</label>
                  <input 
                    type="text" 
                    placeholder="11:00 AM"
                    value={checkOutTime}
                    onChange={(e) => setCheckOutTime(e.target.value)}
                    className="w-full bg-cream/30 border border-line rounded-xl py-2.5 px-4 text-[13.5px] text-forest-dark font-medium focus:outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-charcoal uppercase tracking-wider">Cancellation Policy</label>
                  <input 
                    type="text" 
                    placeholder="Flexible cancellation."
                    value={cancellationPolicy}
                    onChange={(e) => setCancellationPolicy(e.target.value)}
                    className="w-full bg-cream/30 border border-line rounded-xl py-2.5 px-4 text-[13.5px] text-forest-dark font-medium focus:outline-none"
                  />
                </div>
              </div>

              {/* Checklist: Amenities */}
              <div className="flex flex-col gap-2">
                <label className="text-[11px] font-bold text-charcoal uppercase tracking-wider">Stays Amenities</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-cream/15 p-4 border border-line rounded-xl">
                  {mockAmenities.map((amen) => {
                    const checked = selectedAmenities.includes(amen.name);
                    return (
                      <label 
                        key={amen.id} 
                        className="flex items-center gap-2.5 text-[13px] text-charcoal font-medium cursor-pointer select-none"
                      >
                        <input 
                          type="checkbox" 
                          checked={checked}
                          onChange={() => handleAmenityToggle(amen.name)}
                          className="w-4 h-4 rounded border-line text-forest focus:ring-forest cursor-pointer"
                        />
                        <span className={checked ? 'text-forest font-bold' : ''}>{amen.name}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Field: House Rules */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-charcoal uppercase tracking-wider">House Rules (Enter one rule per line)</label>
                <textarea 
                  rows="3"
                  placeholder="e.g. Check-in after 3PM&#10;No smoking inside&#10;No parties allowed"
                  value={rulesInput}
                  onChange={(e) => setRulesInput(e.target.value)}
                  className="w-full bg-cream/30 border border-line rounded-xl py-2.5 px-4 text-[13.5px] text-forest-dark font-medium focus:outline-none focus:border-forest-light"
                />
              </div>

              {/* Field: Google Maps URL */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-charcoal uppercase tracking-wider">Google Maps Location Link</label>
                <input 
                  type="url" 
                  placeholder="e.g. https://maps.app.goo.gl/..."
                  value={googleMapUrl}
                  onChange={(e) => setGoogleMapUrl(e.target.value)}
                  className="w-full bg-cream/30 border border-line rounded-xl py-2.5 px-4 text-[13.5px] text-forest-dark font-medium focus:outline-none focus:border-forest-light"
                />
              </div>

              {/* List: Photo Gallery */}
              <div className="flex flex-col gap-3">
                <label className="text-[11px] font-bold text-charcoal uppercase tracking-wider">Photo Gallery (Upload Stays)</label>
                
                {/* File picker */}
                <div className="flex flex-col items-center justify-center border-2 border-dashed border-line rounded-2xl p-6 bg-cream/5 hover:border-forest/50 hover:bg-cream-deep/10 transition-all cursor-pointer relative group">
                  <input 
                    type="file" 
                    multiple 
                    accept="image/*"
                    onChange={handleFileUpload}
                    disabled={isUploading}
                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                  />
                  <div className="flex flex-col items-center gap-2 text-center text-charcoal-soft group-hover:text-forest transition-colors">
                    {isUploading ? (
                      <>
                        <span className="animate-spin inline-block w-8 h-8 border-2 border-forest border-t-transparent rounded-full mb-1" />
                        <span className="text-[13px] font-semibold text-forest">Uploading stay photos...</span>
                      </>
                    ) : (
                      <>
                        <Plus size={24} className="text-forest-light stroke-[1.5]" />
                        <span className="text-[13px] font-semibold">Select Photos from Device</span>
                        <span className="text-[10.5px]">Upload up to 5 stay images (PNG, JPG, WebP)</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Grid image list */}
                {imageUrlsList.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-cream/15 p-4 border border-line rounded-xl">
                    {imageUrlsList.map((url, idx) => (
                      <div key={idx} className="relative group rounded-lg overflow-hidden h-20 border border-line">
                        <img src={url} alt="Uploaded stays" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => handleRemoveImageUrl(idx)}
                          className="absolute top-1 right-1 p-1 bg-red-600 hover:bg-red-700 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit CTA */}
              <button 
                type="submit"
                className="w-full mt-4 py-3.5 bg-forest hover:bg-forest-light text-white font-semibold rounded-xl text-[14px] text-center shadow-md flex items-center justify-center gap-1.5"
              >
                <Save size={16} />
                <span>{isEditMode ? 'Update Stays Details' : 'Publish Property Listing'}</span>
              </button>

            </form>
          </div>

        </main>
      </div>
    </div>
  );
}
