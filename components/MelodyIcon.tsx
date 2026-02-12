import React from 'react';

export const MelodyIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-full h-full drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]">
    <path
      d="M9 18V5l12-2v13"
      stroke="#d946ef"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="6" cy="18" r="3" fill="#d946ef" />
    <circle cx="18" cy="16" r="3" fill="#d946ef" />
    <path d="M9 5 L 21 3 L 21 8 L 9 10 Z" fill="#f0abfc" />
  </svg>
);

export const ObstacleIcon: React.FC = () => (
  <div className="w-full h-full bg-cyan-900 border-2 border-cyan-400 opacity-80 flex items-center justify-center">
    <div className="w-2/3 h-2/3 bg-cyan-400 animate-pulse"></div>
  </div>
);