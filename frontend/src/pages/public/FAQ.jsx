import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';

export default function FAQ() {
  const [openIdx, setOpenIdx] = useState(null);

  const faqItems = [
    {
      topic: 'Booking',
      question: 'How do I book a stay at CozyCave?',
      answer: 'Booking is easy! Simply search for your desired destination on the homepage or listings page, pick available dates, select the number of guests, and press "Reserve". Fill out the billing/guest details and complete mock payment checkout in under 2 minutes.'
    },
    {
      topic: 'Payment',
      question: 'What payment methods do you support?',
      answer: 'Our checkout forms are built to support future integrations with payment gateways like Razorpay, allowing you to pay securely using Credit/Debit cards, UPI, Wallets, and Netbanking.'
    },
    {
      topic: 'Cancellation',
      question: 'What is the cancellation policy?',
      answer: 'Each property lists its own cancellation policy set by the host (Flexible, Moderate, or Strict). You can find this policy in the property details page under the rules section or review details directly on your receipt after booking confirmation.'
    },
    {
      topic: 'Refunds',
      question: 'When will I receive my refund after cancellation?',
      answer: 'Once a cancellation request is submitted, refunds are processed immediately. The funds will reflect in your account within 5 to 7 business days, depending on your bank.'
    },
    {
      topic: 'Check-in',
      question: 'How do I check-in to my cabin stay?',
      answer: 'A few days prior to check-in, you will receive an email containing exact directions, gate lock codes, and host contact information. Standard check-in begins at 3:00 PM.'
    },
    {
      topic: 'Check-out',
      question: 'What time is checkout and what are house rules?',
      answer: 'Standard checkout is at 11:00 AM. We ask guests to dispose of trash in road bins, lock doors, and turn off air conditioning units. Please review specific host house rules listed in your booking confirmation invoice.'
    }
  ];

  const toggleFAQ = (idx) => {
    if (openIdx === idx) {
      setOpenIdx(null);
    } else {
      setOpenIdx(idx);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 max-w-[800px] mx-auto w-full px-6 py-16">
        
        <div className="text-center mb-12">
          <h2 className="font-fraunces text-3xl md:text-4xl text-forest-dark font-medium mb-2">
            Frequently Asked Questions
          </h2>
          <p className="text-charcoal-soft text-[14.5px] max-w-md mx-auto leading-relaxed">
            Need help with booking, checkout, cancellations, or checking-in? Find quick answers to common questions below.
          </p>
        </div>

        {/* Accordion container */}
        <div className="flex flex-col gap-4">
          {faqItems.map((item, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div 
                key={idx}
                className="bg-white border border-line rounded-xl overflow-hidden shadow-sm transition-all"
              >
                {/* Header toggle button */}
                <button
                  onClick={() => toggleFAQ(idx)}
                  className="w-full text-left p-5 flex items-center justify-between gap-4 focus:outline-none select-none hover:bg-cream/10"
                >
                  <div>
                    <span className="text-[10px] font-bold text-gold uppercase tracking-wider block mb-1">
                      {item.topic}
                    </span>
                    <h3 className="font-fraunces text-[15.5px] md:text-[17px] font-semibold text-forest-dark">
                      {item.question}
                    </h3>
                  </div>
                  <div className="p-1 rounded-full bg-cream">
                    {isOpen ? <ChevronUp size={16} className="text-forest" /> : <ChevronDown size={16} className="text-forest" />}
                  </div>
                </button>

                {/* Answer drawer */}
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-[13.5px] text-charcoal leading-relaxed font-normal border-t border-line/40 anim-fade-up">
                    <p>{item.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </main>

      <Footer />
    </div>
  );
}
