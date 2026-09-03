import React from 'react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';

export default function CancellationPolicy() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 max-w-[800px] mx-auto w-full px-6 py-16">
        <h2 className="font-fraunces text-3xl font-semibold text-forest-dark mb-6">Cancellation Policy</h2>
        
        <div className="prose text-[14.5px] text-charcoal leading-relaxed space-y-6">
          <p>Last updated: August 18, 2026</p>
          <p>
            CozyCave offers standardized cancellation levels to protect both guests and hosts.
          </p>

          <h3 className="font-fraunces text-xl font-semibold text-forest-dark mt-8">Flexible Policy</h3>
          <p>
            Full refund (minus service fees) up to 24 hours prior to check-in. Cancellations made within 24 hours are non-refundable.
          </p>

          <h3 className="font-fraunces text-xl font-semibold text-forest-dark mt-8">Moderate Policy</h3>
          <p>
            Full refund up to 7 days prior to check-in. Cancel up to 48 hours before check-in for a 50% refund.
          </p>

          <h3 className="font-fraunces text-xl font-semibold text-forest-dark mt-8">Strict Policy</h3>
          <p>
            Cancel up to 14 days before check-in for a 50% refund. Cancellations made within 14 days of check-in are completely non-refundable.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
