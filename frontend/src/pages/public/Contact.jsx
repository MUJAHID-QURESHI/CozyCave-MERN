import React from 'react';
import { useSelector } from 'react-redux';
import { Mail, Phone } from 'lucide-react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';

export default function Contact() {
  const { supportEmail, supportPhone, supportPhones = [] } = useSelector((state) => state.settings);
  const phonesToDisplay = supportPhones && supportPhones.length > 0 ? supportPhones : (supportPhone ? [supportPhone] : []);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 max-w-[560px] mx-auto w-full px-6 py-16 flex flex-col justify-center">
        <div className="text-center mb-10">
          <h2 className="font-fraunces text-3xl md:text-4xl text-forest-dark font-medium mb-2">
            Get in touch
          </h2>
          <p className="text-charcoal-soft text-[14px] leading-relaxed">
            Have questions about a stay? Feel free to contact our support channels directly.
          </p>
        </div>

        <div className="flex flex-col gap-6">
          {/* Info details */}
          <div className="bg-white border border-line rounded-2xl p-6 sm:p-8 flex flex-col gap-6 shadow-cozy-sm">
            <h3 className="font-fraunces text-xl font-semibold text-forest-dark border-b border-line pb-3">
              Contact Directory
            </h3>

            <div className="flex items-center gap-3.5 text-[14px] text-charcoal">
              <Mail size={18} className="text-forest flex-shrink-0" />
              <div>
                <span className="font-bold block text-forest-dark">Email Support</span>
                <a href={`mailto:${supportEmail}`} className="text-charcoal-soft font-normal hover:text-forest transition-colors">
                  {supportEmail}
                </a>
              </div>
            </div>

            {phonesToDisplay.map((ph, idx) => (
              <div key={idx} className="flex items-center gap-3.5 text-[14px] text-charcoal">
                <Phone size={18} className="text-forest flex-shrink-0" />
                <div>
                  <span className="font-bold block text-forest-dark">
                    {phonesToDisplay.length > 1 ? `Support Hotline #${idx + 1}` : 'Support Hotline'}
                  </span>
                  <a 
                    href={`tel:${ph.replace(/[^+\d]/g, '')}`} 
                    className="text-charcoal-soft font-normal hover:text-forest transition-colors"
                  >
                    {ph}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
