import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';
import { fetchProperties } from '../../redux/slices/propertySlice';
import { Shield, Sparkles, CalendarRange, Lock, MapPin, Star, ArrowRight } from 'lucide-react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import SearchBar from '../../components/booking/SearchBar';
import PropertyCard from '../../components/property/PropertyCard';
import { mockDestinations, mockAmenities } from '../../data/mockData';

export default function Home() {
  const dispatch = useDispatch();
  const { properties } = useSelector((state) => state.properties);

  useEffect(() => {
    dispatch(fetchProperties());
  }, [dispatch]);

  // Take first 3 properties as featured stays
  const featuredProperties = (properties || []).filter(p => p.isActive).slice(0, 3);

  const differenceCards = [
    {
      title: 'Premium stays',
      description: 'Every home is inspected and styled to a five-star standard.',
      icon: Sparkles
    },
    {
      title: 'Verified properties',
      description: 'Listings are hand-vetted by our team before they go live.',
      icon: Shield
    },
    {
      title: 'Easy booking',
      description: 'Reserve your stay in under two minutes, no back and forth.',
      icon: CalendarRange
    },
    {
      title: 'Secure payments',
      description: 'Encrypted checkout with full protection on every booking.',
      icon: Lock
    },
    {
      title: 'Great locations',
      description: 'From mountain hideaways to beachfront escapes, worldwide.',
      icon: MapPin
    }
  ];

  const popularStays = [
    {
      id: 'prop-1',
      reviewer: 'Emma Morrison',
      initials: 'EM',
      rating: 5,
      stay: 'Stayed in Indore',
      text: 'The cabin felt like it was designed just for us. Every detail, from the linens to the fireplace, made the trip feel effortless.'
    },
    {
      id: 'prop-2',
      reviewer: 'James Delgado',
      initials: 'JD',
      rating: 5,
      stay: 'Stayed in Indore',
      text: 'Booking took two minutes and the villa was even better than the photos. We\'ll be back every summer from now on.'
    },
    {
      id: 'prop-3',
      reviewer: 'Sofia Petrova',
      initials: 'SP',
      rating: 5,
      stay: 'Stayed in Indore',
      text: 'CozyCave finds properties with real character. Our beach house had the warmest, most thoughtful touches throughout.'
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="hero h-[560px] md:h-[640px] bg-forest relative overflow-hidden flex flex-col justify-center py-0">
        <div className="hero-texture absolute inset-0 opacity-50 bg-[radial-gradient(circle_at_15%_20%,rgba(255,255,255,0.05)_0%,transparent_45%),radial-gradient(circle_at_85%_75%,rgba(255,255,255,0.06)_0%,transparent_50%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#051E1A]/15 via-[#051E1A]/5 to-[#051E1A]/55" />
        <div className="hero-inner relative z-10 max-w-[1240px] mx-auto w-full px-6 md:px-12 flex flex-col justify-center">
          <div className="hero-badge anim-fade-up delay-100 animate-float w-fit flex items-center gap-2 bg-cream/15 backdrop-blur-md border border-white/35 px-4 py-2 rounded-full text-cream text-[12.5px] font-semibold tracking-[0.06em] mb-5.5">
            ★ Rated 4.9 by 12,000+ happy guests
          </div>
          <h1 className="anim-fade-up delay-250 font-fraunces text-4xl sm:text-5xl md:text-[58px] leading-[1.08] text-white max-w-[680px] font-medium">
            Your cozy escape,<br />your perfect stay.
          </h1>
          <p className="sub anim-fade-up delay-420 text-cream/90 font-inter text-[16px] md:text-[18px] max-w-[520px] mt-5 leading-relaxed font-normal">
            Hand-picked luxury homes and hideaways, curated for comfort, designed for unforgettable getaways.
          </p>
        </div>
      </section>

      {/* Search Bar Overlay */}
      <div className="anim-fade-up delay-580">
        <SearchBar />
      </div>

      {/* Featured Properties Section */}
      <section className="properties bg-white py-20 px-6 md:px-12">
        <div className="max-w-[1240px] mx-auto">
          <div className="section-head flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 mb-12">
            <div>
              <div className="eyebrow text-forest-light text-[12.5px] font-semibold uppercase tracking-[0.14em] mb-2">
                Handpicked stays
              </div>
              <h2 className="font-fraunces text-3xl md:text-[38px] text-forest-dark font-medium leading-tight">
                Featured properties
              </h2>
            </div>
            <RouterLink 
              to="/properties" 
              className="btn btn-ghost border border-line text-forest-dark text-[14.5px] font-semibold px-7 py-3.5 rounded-full hover:bg-forest hover:text-white hover:border-forest transition-all duration-200"
            >
              View all properties
            </RouterLink>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {featuredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose CozyCave Section */}
      <section className="why bg-cream-deep py-20 px-6 md:px-12">
        <div className="max-w-[1240px] mx-auto">
          <div className="section-head mb-12">
            <div className="eyebrow text-forest-light text-[12.5px] font-semibold uppercase tracking-[0.14em] mb-2">
              The CozyCave difference
            </div>
            <h2 className="font-fraunces text-3xl md:text-[38px] text-forest-dark font-medium leading-tight">
              Why choose CozyCave
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-[22px]">
            {differenceCards.map((card, i) => {
              const Icon = card.icon;
              return (
                <div 
                  key={i} 
                  className="why-card bg-white border border-line rounded-[18px] p-7 text-left hover-lift"
                >
                  <div className="why-icon w-[52px] h-[52px] rounded-[14px] bg-forest text-white flex items-center justify-center mb-5">
                    <Icon size={24} />
                  </div>
                  <h4 className="font-fraunces text-[16.5px] text-forest-dark font-semibold mb-2">
                    {card.title}
                  </h4>
                  <p className="text-[13.5px] text-charcoal-soft leading-relaxed font-normal">
                    {card.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Amenities Section */}
      <section className="amenities bg-white py-20 px-6 md:px-12">
        <div className="max-w-[1240px] mx-auto">
          <div className="section-head mb-12">
            <div className="eyebrow text-forest-light text-[12.5px] font-semibold uppercase tracking-[0.14em] mb-2">
              Every comfort, included
            </div>
            <h2 className="font-fraunces text-3xl md:text-[38px] text-forest-dark font-medium leading-tight">
              Amenities you can count on
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-[18px]">
            {mockAmenities.slice(0, 6).map((amen, i) => {
              const icons = [
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-[26px] h-[26px] text-forest mx-auto mb-3.5"><path d="M5 12.5a11 11 0 0114 0M8 16a6 6 0 018 0M12 20h.01M2 9a15 15 0 0120 0"/></svg>,
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-[26px] h-[26px] text-forest mx-auto mb-3.5"><rect x="3" y="5" width="18" height="12" rx="2"/><path d="M7 21h10M8 17v4M16 17v4"/></svg>,
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-[26px] h-[26px] text-forest mx-auto mb-3.5"><path d="M4 14h16v6H4zM6 14V8a2 2 0 012-2h8a2 2 0 012 2v6M10 6V4M14 6V4"/></svg>,
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-[26px] h-[26px] text-forest mx-auto mb-3.5"><rect x="3" y="8" width="18" height="10" rx="2"/><circle cx="7" cy="13" r="1"/><path d="M11 13h6"/></svg>,
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-[26px] h-[26px] text-forest mx-auto mb-3.5"><rect x="2" y="5" width="20" height="13" rx="2"/><path d="M9 21h6M12 18v3"/></svg>,
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-[26px] h-[26px] text-forest mx-auto mb-3.5"><rect x="4" y="3" width="16" height="18" rx="2"/><circle cx="12" cy="13" r="4"/><path d="M8 6h1"/></svg>
              ];
              return (
                <div 
                  key={amen.id} 
                  className="amen-card border border-line bg-cream rounded-[16px] p-6 text-center hover:translate-y-[-4px] hover:border-forest-light transition-all duration-300"
                >
                  {icons[i] || null}
                  <span className="text-[13.5px] font-semibold text-forest-dark font-inter">
                    {amen.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Destinations Section */}
      <section className="dest bg-forest-dark text-[#F7F5EF] py-20 px-6 md:px-12">
        <div className="max-w-[1240px] mx-auto">
          <div className="section-head flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 mb-12">
            <div>
              <div className="eyebrow text-gold text-[12.5px] font-semibold uppercase tracking-[0.14em] mb-2">
                Where to go next
              </div>
              <h2 className="font-fraunces text-3xl md:text-[38px] text-white font-medium leading-tight">
                Popular destinations
              </h2>
            </div>
            <RouterLink 
              to="/properties" 
              className="btn btn-cream bg-cream text-forest-dark text-[14.5px] font-semibold px-7 py-3.5 rounded-full hover:translate-y-[-2px] hover:shadow-lg transition-all duration-200"
            >
              Explore all
            </RouterLink>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[22px]">
            {mockDestinations.slice(0, 4).map((dest, idx) => {
              // Custom images from Unsplash matching the labels
              const destImages = [
                'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=600&q=80',
                'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
                'https://images.unsplash.com/photo-1498084393753-b411b2d26b34?auto=format&fit=crop&w=600&q=80',
                'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=600&q=80'
              ];
              return (
                <RouterLink 
                  key={dest.id}
                  to="/properties" 
                  className="dest-card rounded-[18px] overflow-hidden relative h-[280px] hover:translate-y-[-6px] transition-transform duration-350 block group"
                >
                  <img 
                    src={destImages[idx]} 
                    alt={dest.name} 
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-106"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-[#051e1a]/0 via-[#051e1a]/20 to-[#051e1a]/85" />
                  <div className="dest-label absolute bottom-0 left-0 right-0 z-10 p-5">
                    <h4 className="text-white font-fraunces text-[19px] font-medium">
                      {dest.name}
                    </h4>
                  </div>
                </RouterLink>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials/Reviews Section */}
      <section className="reviews bg-cream py-20 px-6 md:px-12">
        <div className="max-w-[1240px] mx-auto">
          <div className="section-head mb-12">
            <div className="eyebrow text-forest-light text-[12.5px] font-semibold uppercase tracking-[0.14em] mb-2">
              Loved by guests
            </div>
            <h2 className="font-fraunces text-3xl md:text-[38px] text-forest-dark font-medium leading-tight">
              What our guests say
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
            {popularStays.map((rev) => (
              <div 
                key={rev.id}
                className="review-card bg-white border border-line rounded-[18px] p-[30px] shadow-cozy-sm hover-lift"
              >
                <div className="stars flex gap-1 text-gold mb-[18px]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} className="fill-current text-gold" />
                  ))}
                </div>
                <p className="quote text-[14.5px] line-clamp-4 leading-relaxed text-charcoal mb-6 font-inter font-normal">
                  "{rev.text}"
                </p>
                <div className="reviewer flex items-center gap-3">
                  <div className="avatar w-10 h-10 rounded-full bg-forest text-white flex items-center justify-center font-fraunces font-bold text-sm">
                    {rev.initials}
                  </div>
                  <div>
                    <h5 className="text-[14.5px] font-semibold text-forest-dark font-inter leading-none mb-1">
                      {rev.reviewer}
                    </h5>
                    <span className="text-[12.5px] text-charcoal-soft font-inter">
                      {rev.stay}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta bg-forest text-white text-center py-[100px] px-6 relative overflow-hidden">
        <div className="absolute w-[520px] h-[520px] rounded-full border border-white/8 -top-[260px] -right-[140px] pointer-events-none" />
        <div className="absolute w-[380px] h-[380px] rounded-full border border-white/8 -bottom-[220px] -left-[100px] pointer-events-none" />
        
        <div className="relative z-10 max-w-[600px] mx-auto">
          <div className="eyebrow text-gold text-[12.5px] font-semibold uppercase tracking-[0.14em] mb-2">
            Ready when you are
          </div>
          <h2 className="font-fraunces text-4xl md:text-[42px] font-medium text-white mb-4 leading-tight">
            Find your perfect cozy stay
          </h2>
          <p className="text-cream/80 text-[16px] max-w-[480px] mx-auto mb-8 font-inter font-normal leading-relaxed">
            Join thousands of travelers who've found their home away from home with CozyCave.
          </p>
          <RouterLink 
            to="/properties" 
            className="btn btn-cream bg-cream text-forest-dark text-[15px] font-semibold px-9 py-4 rounded-full hover:translate-y-[-2px] hover:shadow-[0_14px_28px_-10px_rgba(0,0,0,0.35)] transition-all duration-200 inline-flex items-center gap-2"
          >
            <span>Book now</span>
            <ArrowRight size={16} />
          </RouterLink>
        </div>
      </section>

      <Footer />
    </div>
  );
}
