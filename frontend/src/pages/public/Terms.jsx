import React from 'react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';

export default function Terms() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 max-w-[800px] mx-auto w-full px-6 py-16">
        <h2 className="font-fraunces text-3xl font-semibold text-forest-dark mb-6">Terms of Service</h2>
        
        <div className="prose text-[14.5px] text-charcoal leading-relaxed space-y-6">
          <p>Last updated: August 18, 2026</p>
          <p>
            By accessing and booking stays through CozyCave, you agree to comply with the terms and conditions outlined below.
          </p>

          <h3 className="font-fraunces text-xl font-semibold text-forest-dark mt-8">1. Guest Responsibilities</h3>
          <p>
            Guests must respect the host's house rules, stay capacities, check-in timings, and local noise ordinances. Any damage caused during stays is the financial responsibility of the registered booking holder.
          </p>

          <h3 className="font-fraunces text-xl font-semibold text-forest-dark mt-8">2. Pricing and Payments</h3>
          <p>
            Prices are calculated dynamically based on price per night and service charges. Stays are locked upon payment confirmations.
          </p>

          <h3 className="font-fraunces text-xl font-semibold text-forest-dark mt-8">3. Modifications & Cancellations</h3>
          <p>
            Stays can be cancelled directly through "My Bookings" according to the specific cancellation policy listed by the property host.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
