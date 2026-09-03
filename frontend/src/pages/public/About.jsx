import React from 'react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import aboutExterior from '../../assets/about-exterior.jpg';
import aboutInterior from '../../assets/about-interior.jpg';

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

        {/* Content sections: About CozyCave */}
        <section className="py-20 px-6 md:px-12 bg-white">
          <div className="max-w-[1000px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="font-fraunces text-2xl md:text-3xl text-forest-dark mb-5 font-semibold">
                About CozyCave
              </h3>
              <p className="text-[14.5px] text-charcoal leading-relaxed mb-4 font-inter">
                Founded in 2026, CozyCave was created with a simple vision: to offer travelers more than just a place to stay. We believe every journey deserves a comfortable, memorable, and thoughtfully curated home away from home.
              </p>
              <p className="text-[14.5px] text-charcoal leading-relaxed font-inter">
                From peaceful escapes to unique stays in beautiful surroundings, CozyCave brings together carefully selected properties designed for comfort, privacy, and unforgettable experiences. Our goal is to make every stay feel personal, effortless, and truly special.
              </p>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-md bg-cream relative max-w-[420px] w-full mx-auto md:ml-auto">
              <img 
                src={aboutExterior} 
                alt="Modern A-frame house exterior at sunset" 
                className="w-full h-auto block rounded-2xl"
              />
            </div>
          </div>
        </section>

        {/* Mission and Standards section */}
        <section className="py-20 px-6 md:px-12 bg-cream">
          <div className="max-w-[1000px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="font-fraunces text-2xl md:text-3xl text-forest-dark mb-5 font-semibold">
                Our Mission & Standards
              </h3>
              <p className="text-[14.5px] text-charcoal leading-relaxed mb-4 font-inter">
                At CozyCave, our mission is to make every stay feel comfortable, reliable, and memorable. We focus on creating a seamless experience from discovering the perfect stay to completing your booking and arriving at your destination.
              </p>
              <p className="text-[14.5px] text-charcoal leading-relaxed font-inter">
                Every CozyCave property is selected with attention to comfort, cleanliness, privacy, and the overall guest experience. We believe great stays are created through thoughtful spaces, transparent information, and service that guests can trust.
              </p>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-md bg-cream-deep relative max-w-[460px] w-full mx-auto md:ml-auto">
              <img 
                src={aboutInterior} 
                alt="Cozy modern living room interior" 
                className="w-full h-auto block rounded-2xl"
              />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
