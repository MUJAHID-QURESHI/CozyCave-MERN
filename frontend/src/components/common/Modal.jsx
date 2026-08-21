import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export default function Modal({ isOpen, onClose, title, children }) {
  // Disable body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-forest-dark/40 backdrop-blur-sm transition-opacity"
      />

      {/* Modal Dialog */}
      <div className="relative bg-white rounded-2xl shadow-cozy border border-line max-w-lg w-full max-h-[90vh] overflow-y-auto z-10 flex flex-col anim-fade-up">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-line">
          <h3 className="font-fraunces text-lg md:text-xl font-semibold text-forest-dark">
            {title}
          </h3>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-full text-charcoal hover:bg-cream-deep hover:text-forest-dark transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 text-[14.5px] text-charcoal leading-relaxed">
          {children}
        </div>
      </div>
    </div>
  );
}
