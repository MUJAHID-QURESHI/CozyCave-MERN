import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Star, MapPin, Heart } from 'lucide-react';
import { toggleFavoriteThunk } from '../../redux/slices/favoriteSlice';
import { addToast } from '../../redux/slices/uiSlice';

export default function PropertyCard({ property }) {
  const dispatch = useDispatch();
  const favorites = useSelector((state) => state.favorites.favorites || []);
  
  const { id, name, location, city, state, rating, amenities, price, tag, images } = property;
  const isFavorite = favorites.some(fav => 
    (fav.property?._id === id) || 
    (fav.property === id) ||
    (fav._id === id)
  );

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(toggleFavoriteThunk(id));
    dispatch(addToast({
      message: isFavorite ? `Removed ${name} from favorites` : `Added ${name} to favorites!`,
      type: 'success'
    }));
  };

  const mainImage = images && images.length > 0 ? images[0] : null;

  return (
    <div className="prop-card bg-cream border border-line rounded-[20px] overflow-hidden shadow-cozy-sm hover-lift group">
      
      {/* Image & Tag & Fav Button */}
      <div className="prop-img relative h-[230px] img-hover-zoom">
        {mainImage ? (
          <img 
            src={mainImage} 
            alt={name} 
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="photo">
            <svg className="photo-icon w-[52px] h-[52px] text-forest absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-25 group-hover:scale-108 transition-transform duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M3 11l9-8 9 8" />
              <path d="M5 10v10h14V10" />
              <path d="M9 20v-6h6v6" />
            </svg>
            <span className="photo-label absolute bottom-3.5 left-4 font-semibold text-[11px] uppercase tracking-wider text-forest-light/60">
              {name} — PHOTO
            </span>
          </div>
        )}

        {tag && (
          <span className="prop-tag absolute top-4 left-4 bg-forest text-white text-[11.5px] font-bold px-3.5 py-1.5 rounded-full tracking-[0.03em] shadow-sm z-10">
            {tag}
          </span>
        )}

        <button 
          onClick={handleFavoriteClick}
          className="prop-fav absolute top-4 right-4 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center shadow-[0_4px_10px_rgba(0,0,0,0.15)] hover:scale-112 transition-transform duration-200 z-10 focus:outline-none"
          title={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart 
            size={17} 
            className={`transition-colors duration-200 ${
              isFavorite 
                ? 'fill-red-500 text-red-500' 
                : 'text-forest stroke-[2.2]'
            }`} 
          />
        </button>
      </div>

      {/* Card Body */}
      <div className="prop-body p-[22px] flex flex-col justify-between">
        
        {/* Title and Rating */}
        <div>
          <div className="prop-top flex justify-between items-start mb-1.5">
            <h3 className="font-fraunces text-[19px] font-semibold leading-tight text-forest-dark truncate pr-4 group-hover:text-forest transition-colors duration-200">
              {name}
            </h3>
            <div className="rating flex items-center gap-1 text-[13.5px] font-bold text-forest-dark bg-cream-deep/60 px-2 py-0.5 rounded-md">
              <Star size={14} className="fill-gold text-gold" />
              <span>{rating.toFixed(2)}</span>
            </div>
          </div>

          {/* Location */}
          <div className="prop-loc text-[13.5px] text-charcoal-soft flex items-center gap-1 mb-3.5">
            <MapPin size={13} className="text-charcoal-soft stroke-[2]" />
            <span>{city}, {state}</span>
          </div>

          {/* Amenities Pills */}
          <div className="amenity-row flex flex-wrap gap-2.5 mb-[18px]">
            {amenities.slice(0, 3).map((amenity) => (
              <span 
                key={amenity} 
                className="amenity-pill text-[12px] font-semibold text-forest-light bg-forest/5 px-[11px] py-[5px] rounded-[8px]"
              >
                {amenity}
              </span>
            ))}
            {amenities.length > 3 && (
              <span className="amenity-pill text-[11px] font-semibold text-charcoal-soft bg-cream-deep/50 px-2 py-1 rounded-[8px]">
                +{amenities.length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* Footer info: price and view link */}
        <div className="prop-foot flex justify-between items-center pt-4 border-t border-line mt-auto">
          <div className="price font-inter text-[19px] font-bold text-forest-dark">
            ₹{price} <span className="text-[13px] font-normal text-charcoal-soft">/ night</span>
          </div>
          <Link to={`/properties/${id}`} className="view-btn text-[13.5px] font-bold text-forest-dark hover:text-forest-light flex items-center gap-1 group/btn transition-colors duration-200">
            View details 
            <span className="transform transition-transform duration-200 group-hover/btn:translate-x-1">→</span>
          </Link>
        </div>

      </div>

    </div>
  );
}
