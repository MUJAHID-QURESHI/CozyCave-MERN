import React from 'react';
import { useSelector } from 'react-redux';
import { Mail, Phone, MapPin } from 'lucide-react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';

export default function Contact() {
  const { supportEmail, supportPhone, supportAddress } = useSelector((state) => state.settings);
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 max-w-[500px] mx-auto w-full px-6 py-16 flex flex-col justify-center">
        <div className="text-center mb-10">
          <h2 className="font-fraunces text-3xl md:text-4xl text-forest-dark font-medium mb-2">
            Get in touch
          </h2>
          <p className="text-charcoal-soft text-[14px] leading-relaxed">
            Have questions about a stay? Feel free to contact us via support channels.
          </p>
        </div>

        <div className="flex flex-col gap-6">
          {/* Info details */}
          <div className="bg-white border border-line rounded-2xl p-6 flex flex-col gap-5 shadow-cozy-sm">
            <h3 className="font-fraunces text-xl font-semibold text-forest-dark mb-2">Contact Directory</h3>
            
            <div className="flex items-start gap-3.5 text-[14px] text-charcoal">
              <MapPin size={18} className="text-forest mt-0.5 flex-shrink-0" />
              <div>
                <span className="font-bold block">Headquarters</span>
                <span className="text-charcoal-soft font-normal">{supportAddress}</span>
              </div>
            </div>

            <div className="flex items-center gap-3.5 text-[14px] text-charcoal">
              <Mail size={18} className="text-forest flex-shrink-0" />
              <div>
                <span className="font-bold block">Email Support</span>
                <span className="text-charcoal-soft font-normal">{supportEmail}</span>
              </div>
            </div>

            <div className="flex items-center gap-3.5 text-[14px] text-charcoal">
              <Phone size={18} className="text-forest flex-shrink-0" />
              <div>
                <span className="font-bold block">Support Hotline</span>
                <span className="text-charcoal-soft font-normal">{supportPhone}</span>
              </div>
            </div>
          </div>

          {/* Map placeholder */}
          <div className="min-h-[220px] bg-cream-deep border border-line rounded-2xl relative overflow-hidden flex flex-col justify-center items-center text-center px-4 shadow-inner">
            <MapPin size={32} className="text-forest mb-2.5" />
            <h5 className="font-fraunces text-[14.5px] font-semibold text-forest-dark">Office location</h5>
            <p className="text-charcoal-soft text-[11px] max-w-[300px] mt-1">{supportAddress}</p>
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,rgba(8,69,62,0.4)_0%,transparent_70%)]" />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
