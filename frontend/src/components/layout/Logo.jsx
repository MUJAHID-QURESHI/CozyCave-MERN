import React from 'react';
import { Link } from 'react-router-dom';

export default function Logo({ light = false, className = '' }) {
  return (
    <Link to="/" className={`logo flex items-center gap-3 ${className}`}>
      <div className={`logo-mark w-12 h-12 rounded-full flex items-center justify-center relative border-3 shadow-md transition-transform duration-200 hover:scale-105 ${
        light 
          ? 'bg-cream border-forest-dark' 
          : 'bg-forest border-white'
      }`}>
        <svg 
          viewBox="0 0 100 50" 
          fill="none" 
          stroke={light ? "#08453E" : "#F7F5EF"} 
          strokeWidth="4.5" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          className="w-7 h-4"
        >
          <path d="M9 38a4 4 0 118 0"/>
          <path d="M13 38c8 2 13-2 18-10 3-5 6-8 10-8"/>
          <path d="M40 20v-7c0-2 1.5-3 4-3h9c2.5 0 4 1 4 3v13c0 2-1.5 3-4 3"/>
          <path d="M57 24c9 8 17 11 27 9"/>
        </svg>
      </div>
      <div className="flex flex-col justify-center">
        <span className={`font-fraunces text-xl font-semibold leading-none ${
          light ? 'text-white' : 'text-forest-dark'
        }`}>
          The Cozy Cave
        </span>
        <span className={`font-inter text-[10px] tracking-[0.18em] font-semibold mt-1 ${
          light ? 'text-cream/70' : 'text-charcoal-soft'
        }`}>
          VACATION RENTALS
        </span>
      </div>
    </Link>
  );
}
