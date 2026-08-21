import React from 'react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';

export default function PrivacyPolicy() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 max-w-[800px] mx-auto w-full px-6 py-16">
        <h2 className="font-fraunces text-3xl font-semibold text-forest-dark mb-6">Privacy Policy</h2>
        
        <div className="prose text-[14.5px] text-charcoal leading-relaxed space-y-6">
          <p>Last updated: August 18, 2026</p>
          <p>
            At The Cozy Cave (CozyCave), we value the privacy and safety of our guests and hosts. This privacy policy describes how we collect, use, and process your personal information when you use our website booking portal.
          </p>

          <h3 className="font-fraunces text-xl font-semibold text-forest-dark mt-8">1. Information We Collect</h3>
          <p>
            We collect personal details that you provide directly to us during account registration, editing your profile, or checkout. This includes name, email, phone number, credentials, and checkout booking information. We do not store sensitive payment gateway passwords.
          </p>

          <h3 className="font-fraunces text-xl font-semibold text-forest-dark mt-8">2. How We Use Information</h3>
          <p>
            We use collected information to confirm stays, handle transactions, check availability blocks, notify hosts, and send confirmations. We do not sell or lease details to third-party marketing companies.
          </p>

          <h3 className="font-fraunces text-xl font-semibold text-forest-dark mt-8">3. Security Standards</h3>
          <p>
            All connection links are encrypted using industry-standard protocols. Mock gateways simulate safe and protected environments preparing secure payment integrations.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
