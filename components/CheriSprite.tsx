import React from 'react';

interface CheriSpriteProps {
  isRunning: boolean;
  isJumping: boolean;
}

export const CheriSprite: React.FC<CheriSpriteProps> = ({ isRunning, isJumping }) => {
  // Enhanced Anime-style Pixel Art Sprite
  return (
    <svg width="100%" height="100%" viewBox="0 0 48 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-[0_0_8px_rgba(217,70,239,0.6)]">
      
      {/* --- Back Hair (Flowing) --- */}
      <g transform={isJumping ? "translate(0, -2)" : ""}>
        <path d="M12 16 C 4 30, 0 45, 4 55 L 14 58 L 16 40 Z" fill="#312e81" />
        <path d="M36 16 C 44 30, 48 45, 44 55 L 34 58 L 32 40 Z" fill="#312e81" />
        {/* Hair Highlights */}
        <path d="M8 35 Q 6 45, 8 50" stroke="#6366f1" strokeWidth="2" fill="none" opacity="0.5" />
        <path d="M40 35 Q 42 45, 40 50" stroke="#6366f1" strokeWidth="2" fill="none" opacity="0.5" />
      </g>
      
      {/* --- Body/Outfit --- */}
      {/* Skirt/Legs Background */}
      <rect x="16" y="44" width="16" height="8" fill="#1e1b4b" />
      
      {/* Legs */}
      <g transform={isRunning && !isJumping ? "translate(0,0)" : ""}>
         {/* Left Leg */}
         <rect x="17" y="52" width="5" height="12" fill="#ffedd5" />
         <rect x="16" y="60" width="7" height="4" fill="#d946ef" rx="1" /> {/* Boot */}
         
         {/* Right Leg */}
         <rect x="26" y="52" width="5" height="12" fill="#ffedd5" />
         <rect x="25" y="60" width="7" height="4" fill="#d946ef" rx="1" /> {/* Boot */}
         
         {/* Visual movement illusion for running (simple visibility toggle effect not possible without state, so we rely on static pose looking dynamic) */}
      </g>

      {/* Torso */}
      <rect x="16" y="32" width="16" height="14" fill="#e0e7ff" />
      {/* Pink Tie / Ribbon */}
      <path d="M24 34 L 21 38 L 24 40 L 27 38 Z" fill="#d946ef" />
      {/* Skirt Pleats */}
      <path d="M16 46 L 16 52 L 32 52 L 32 46 L 28 46 L 28 50 L 24 46 L 20 50 L 20 46 Z" fill="#312e81" />
      <rect x="16" y="50" width="16" height="2" fill="#d946ef" />

      {/* --- Head --- */}
      <rect x="11" y="6" width="26" height="24" rx="6" fill="#ffedd5" />
      
      {/* Face */}
      {/* Blush */}
      <ellipse cx="15" cy="22" rx="3" ry="1.5" fill="#fbcfe8" />
      <ellipse cx="33" cy="22" rx="3" ry="1.5" fill="#fbcfe8" />
      
      {/* Eyes (Blue & Shiny) */}
      <g>
        <rect x="14" y="16" width="6" height="5" rx="1" fill="#1e293b" />
        <rect x="28" y="16" width="6" height="5" rx="1" fill="#1e293b" />
        {/* Iris */}
        <rect x="15" y="16" width="4" height="4" fill="#0ea5e9" />
        <rect x="29" y="16" width="4" height="4" fill="#0ea5e9" />
        {/* Sparkle */}
        <rect x="15" y="16" width="2" height="2" fill="#ffffff" />
        <rect x="29" y="16" width="2" height="2" fill="#ffffff" />
      </g>

      {/* Mouth */}
      <rect x="23" y="25" width="2" height="1" fill="#db2777" />

      {/* --- Front Hair --- */}
      <path d="M11 6 L 37 6 L 37 18 L 34 12 L 28 18 L 24 10 L 20 18 L 14 12 L 11 20 Z" fill="#312e81" />
      {/* Side Bangs */}
      <path d="M11 6 L 8 20 L 12 28 L 14 20" fill="#312e81" />
      <path d="M37 6 L 40 20 L 36 28 L 34 20" fill="#312e81" />
      
      {/* --- Cat Ear Headphones --- */}
      {/* Band */}
      <path d="M10 14 C 10 -2, 38 -2, 38 14" stroke="#1e1b4b" strokeWidth="3" fill="none" />
      {/* Ears */}
      <path d="M12 2 L 18 10 L 10 10 Z" fill="#d946ef" stroke="#1e1b4b" strokeWidth="1" />
      <path d="M36 2 L 30 10 L 38 10 Z" fill="#d946ef" stroke="#1e1b4b" strokeWidth="1" />
      {/* Cups */}
      <rect x="7" y="12" width="5" height="10" rx="2" fill="#d946ef" stroke="#1e1b4b" strokeWidth="1" />
      <rect x="36" y="12" width="5" height="10" rx="2" fill="#d946ef" stroke="#1e1b4b" strokeWidth="1" />
      {/* Glowing Light on Cups */}
      <rect x="8.5" y="14" width="2" height="6" rx="1" fill="#a5f3fc" className="animate-pulse" />
      <rect x="37.5" y="14" width="2" height="6" rx="1" fill="#a5f3fc" className="animate-pulse" />

      {/* --- Arms --- */}
      {/* Left Arm */}
      <rect x="10" y="34" width="5" height="10" rx="2" fill="#e0e7ff" 
        transform={isJumping ? "rotate(-150 12 36)" : (isRunning ? "rotate(25 12 36)" : "rotate(10 12 36)")} 
      />
      <circle cx="12.5" cy="44" r="2.5" fill="#ffedd5" transform={isJumping ? "rotate(-150 12 36)" : (isRunning ? "rotate(25 12 36)" : "rotate(10 12 36)")} />
      
      {/* Right Arm */}
      <rect x="33" y="34" width="5" height="10" rx="2" fill="#e0e7ff" 
        transform={isJumping ? "rotate(150 36 36)" : (isRunning ? "rotate(-25 36 36)" : "rotate(-10 36 36)")} 
      />
      <circle cx="35.5" cy="44" r="2.5" fill="#ffedd5" transform={isJumping ? "rotate(150 36 36)" : (isRunning ? "rotate(-25 36 36)" : "rotate(-10 36 36)")} />

    </svg>
  );
};