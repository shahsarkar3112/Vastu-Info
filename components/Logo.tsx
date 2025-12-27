
import React from 'react';

const Logo: React.FC = () => {
  return (
    <div className="relative w-10 h-10 flex items-center justify-center">
      {/* Outer Glow */}
      <div className="absolute inset-0 bg-orange-400/20 rounded-lg blur-lg animate-pulse" />
      
      {/* Mandala Square */}
      <div className="absolute inset-0 border-2 border-indigo-600 rounded-lg rotate-45" />
      <div className="absolute inset-0 border-2 border-orange-500 rounded-lg" />
      
      {/* Inner Sun Icon */}
      <svg className="w-6 h-6 text-indigo-700 z-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2" />
        <path d="M12 20v2" />
        <path d="m4.93 4.93 1.41 1.41" />
        <path d="m17.66 17.66 1.41 1.41" />
        <path d="M2 12h2" />
        <path d="M20 12h2" />
        <path d="m6.34 17.66-1.41 1.41" />
        <path d="m19.07 4.93-1.41 1.41" />
      </svg>
    </div>
  );
};

export default Logo;
