import React from 'react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';

export default function About() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow">
        {/* Banner */}
        <section className="bg-forest py-20 px-6 text-center text-white relative">
          <div className="max-w-2xl mx-auto">
            <h2 className="font-fraunces text-4xl md:text-5xl text-white mb-4 font-medium">Our Story</h2>
            <p className="text-cream/80 text-[15px] md:text-[17px] leading-relaxed">
              Redefining hospitality by curating unique spaces that inspire connection, relaxation, and memorable adventures.
            </p>
          </div>
        </section>

        {/* Content sections */}
        <section className="py-20 px-6 md:px-12 bg-white">
          <div className="max-w-[1000px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="font-fraunces text-2xl md:text-3xl text-forest-dark mb-5 font-semibold">
                About CozyCave
              </h3>
              <p className="text-[14.5px] text-charcoal leading-relaxed mb-4 font-inter">
                Founded in 2024, CozyCave was created for travelers who seek more than a typical hotel room. We believe the place you sleep should be as memorable as the destination itself.
              </p>
              <p className="text-[14.5px] text-charcoal leading-relaxed font-inter">
                We scour the country's most scenic regions—from quiet forest meadows and soaring mountain ranges to peaceful coastal shores—to handpick homes that have unique character, elegant design, and top-tier comfort.
              </p>
            </div>
            <div className="h-[300px] rounded-2xl overflow-hidden shadow-md bg-cream relative">
              <img 
                src="https://images.unsplash.com/photo-1542718610-a1d656d1884c?auto=format&fit=crop&w=600&q=80" 
                alt="Cozy stay cabin view" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </section>

        {/* Mission and Hospitality section */}
        <section className="py-20 px-6 md:px-12 bg-cream">
          <div className="max-w-[1000px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="h-[300px] rounded-2xl overflow-hidden shadow-md bg-cream-deep md:order-last">
              <img 
                src="https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=600&q=80" 
                alt="Cozy interior room" 
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h3 className="font-fraunces text-2xl md:text-3xl text-forest-dark mb-5 font-semibold">
                Our Mission & Standards
              </h3>
              <p className="text-[14.5px] text-charcoal leading-relaxed mb-4 font-inter">
                We hold ourselves to a "five-star cozy standard". This means every property in our collection is physically inspected, styled, and equipped with premium amenities (like high-speed Wi-Fi, fully stocked kitchens, fireplace, or hot tubs) before we publish them.
              </p>
              <p className="text-[14.5px] text-charcoal leading-relaxed font-inter">
                Our ultimate goal is to facilitate seamless, stress-free bookings so that you can spend less time logistics planning and more time enjoying your vacation getaway.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
