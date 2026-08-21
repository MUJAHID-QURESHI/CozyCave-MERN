import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import PropertyCard from '../../components/property/PropertyCard';
import { fetchFavorites } from '../../redux/slices/favoriteSlice';

export default function Favorites() {
  const dispatch = useDispatch();
  const favorites = useSelector((state) => state.favorites.favorites || []);

  useEffect(() => {
    dispatch(fetchFavorites());
  }, [dispatch]);

  const favoriteProperties = favorites
    .map((fav) => {
      const p = fav.property;
      if (!p) return null;
      return {
        ...p,
        id: p._id || p.id,
        price: p.pricePerNight || p.price,
        city: p.location?.city || p.city,
        state: p.location?.state || p.state,
      };
    })
    .filter((p) => p !== null);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 max-w-[1240px] mx-auto w-full px-6 md:px-12 py-12">
        <h2 className="font-fraunces text-3xl font-semibold text-forest-dark mb-10">My Favorites</h2>

        {favoriteProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {favoriteProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 px-4 bg-white border border-line rounded-2xl flex flex-col items-center">
            <Heart size={44} className="text-charcoal-soft opacity-30 mb-4 stroke-[1.5]" />
            <h3 className="font-fraunces text-xl font-semibold text-forest-dark mb-1">
              Your favorites list is empty
            </h3>
            <p className="text-charcoal-soft text-[13.5px] max-w-sm mb-6">
              Explore our handpicked collection and tap the heart icon on any stay to save it here for later.
            </p>
            <Link to="/properties" className="px-6 py-2.5 bg-forest text-white rounded-full font-semibold text-[13.5px]">
              Explore Stays
            </Link>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
