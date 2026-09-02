import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Instagram, Mail, Phone } from 'lucide-react';
import Logo from './Logo';

const WhatsappIcon = ({ size = 16 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor">
    <path d="M12.004 2C6.48 2 2 6.48 2 12.004c0 1.91.5 3.706 1.385 5.277L2 22l4.89-.1.97-.507c1.3.69 2.76 1.05 4.14 1.05 5.52 0 10-4.48 10-10C22.004 6.48 17.52 2 12.004 2zm.006 1.836c4.507 0 8.162 3.655 8.162 8.162 0 4.507-3.655 8.162-8.162 8.162-1.386 0-2.685-.353-3.822-1.018l-.56-.339-2.846.577.588-2.723-.39-.61c-.742-1.157-1.118-2.512-1.118-3.89 0-4.507 3.655-8.162 8.162-8.162h.026zm-3.645 4.188c-.2 0-.34.07-.46.21-.12.14-.46.45-.46 1.09s.46 1.25.53 1.34c.07.09.9 1.38 2.19 1.93.31.13.55.21.74.27.31.1.6.09.83.05.25-.04.77-.32.88-.62.11-.3.11-.56.08-.62-.03-.06-.11-.09-.24-.16s-.77-.38-.89-.42c-.12-.04-.21-.07-.3.07-.09.14-.35.45-.43.54-.08.09-.16.1-.29.03-.13-.07-.56-.21-1.07-.66-.4-.35-.66-.79-.74-.92-.08-.13-.01-.2.06-.26.06-.06.13-.15.2-.22.07-.07.09-.12.14-.2.05-.08.02-.15-.01-.22-.03-.07-.29-.71-.4-.98-.12-.27-.24-.23-.33-.23h-.23z" />
  </svg>
);

export default function Footer() {
  const { supportEmail, supportPhone, supportPhones = [], whatsappLink } = useSelector((state) => state.settings);
  const phonesToDisplay = supportPhones && supportPhones.length > 0 ? supportPhones : (supportPhone ? [supportPhone] : []);

  return (
    <footer className="bg-forest-dark text-[#F7F5EF]/70 py-16 px-6 md:px-12 border-t border-line">
      <div className="max-w-[1240px] mx-auto">
        {/* Foot Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-14">
          
          {/* Logo & Brand Info */}
          <div className="flex flex-col gap-4">
            <Logo light={true} />
            <p className="text-[13.5px] leading-relaxed max-w-[280px]">
              Curated vacation rentals for travelers who want more than a place to sleep — a place that feels like home.
            </p>
            <div className="flex gap-3 mt-2">
              <a 
                href="https://www.instagram.com/thecozycave.in?igsh=MXFncnZhaTRlODlyYw==" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-9 h-9 rounded-full border border-cream/25 flex items-center justify-center text-cream hover:bg-cream/10 hover:border-cream/50 transition-colors duration-200" 
                aria-label="Instagram"
              >
                <Instagram size={16} />
              </a>
              <a 
                href={whatsappLink} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-9 h-9 rounded-full border border-cream/25 flex items-center justify-center text-cream hover:bg-cream/10 hover:border-cream/50 transition-colors duration-200" 
                aria-label="WhatsApp"
              >
                <WhatsappIcon size={16} />
              </a>
            </div>
          </div>

          {/* Explore Links */}
          <div>
            <h5 className="text-white text-[14.5px] font-semibold mb-5 font-inter">Explore</h5>
            <ul className="flex flex-col gap-3">
              <li><Link to="/" className="text-[13.5px] hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/properties" className="text-[13.5px] hover:text-white transition-colors">Properties</Link></li>
              <li><Link to="/about" className="text-[13.5px] hover:text-white transition-colors">About us</Link></li>
              <li><Link to="/faq" className="text-[13.5px] hover:text-white transition-colors">FAQ</Link></li>
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h5 className="text-white text-[14.5px] font-semibold mb-5 font-inter">Support</h5>
            <ul className="flex flex-col gap-3">
              <li><Link to="/faq" className="text-[13.5px] hover:text-white transition-colors">Help center</Link></li>
              <li><Link to="/cancellation-policy" className="text-[13.5px] hover:text-white transition-colors">Cancellation policy</Link></li>
              <li><Link to="/terms" className="text-[13.5px] hover:text-white transition-colors">Terms of service</Link></li>
              <li><Link to="/contact" className="text-[13.5px] hover:text-white transition-colors">Contact us</Link></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h5 className="text-white text-[14.5px] font-semibold mb-5 font-inter">Contact</h5>
            <ul className="flex flex-col gap-3 text-[13.5px]">
              <li className="flex items-center gap-2.5">
                <Mail size={16} className="text-gold flex-shrink-0" />
                <a href={`mailto:${supportEmail}`} className="hover:text-white transition-colors">{supportEmail}</a>
              </li>
              {phonesToDisplay.map((ph, idx) => (
                <li key={idx} className="flex items-center gap-2.5">
                  <Phone size={16} className="text-gold flex-shrink-0" />
                  <a href={`tel:${ph.replace(/[^+\d]/g, '')}`} className="hover:text-white transition-colors">
                    {ph}
                  </a>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Footer Bottom */}
        <div className="border-t border-[#F7F5EF]/10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-[12.5px] text-[#F7F5EF]/50">
          <span>© 2026 The Cozy Cave. All rights reserved.</span>
          <div className="flex gap-4">
            <Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy policy</Link>
            <span>·</span>
            <Link to="/terms" className="hover:text-white transition-colors">Terms of service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
