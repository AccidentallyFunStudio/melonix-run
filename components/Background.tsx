import React from 'react';

export const CityBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      {/* Sky Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-950 via-purple-950 to-slate-900" />
      
      {/* Moon */}
      <div className="absolute top-10 right-10 w-32 h-32 rounded-full bg-indigo-200 opacity-20 blur-sm" />
      <div className="absolute top-12 right-8 w-24 h-24 rounded-full bg-indigo-100 opacity-10" />

      {/* Stars */}
      <div className="absolute top-20 left-20 w-1 h-1 bg-white animate-pulse" />
      <div className="absolute top-40 left-1/3 w-2 h-2 bg-pink-300 animate-pulse" style={{ animationDelay: '0.5s' }} />
      <div className="absolute top-10 right-1/2 w-1 h-1 bg-cyan-300 animate-pulse" style={{ animationDelay: '1s' }} />

      {/* Far Buildings (Parallax Layer 1) - CSS animation handles the scroll */}
      <div className="absolute bottom-20 left-0 right-0 h-64 flex items-end opacity-30 space-x-2 w-[200%] animate-[slide_60s_linear_infinite]">
         {[...Array(20)].map((_, i) => (
            <div key={i} className="bg-indigo-900 w-24 mx-2" style={{ height: `${Math.random() * 50 + 30}%` }}></div>
         ))}
      </div>

       {/* Near Buildings (Parallax Layer 2) */}
       <div className="absolute bottom-20 left-0 right-0 h-48 flex items-end opacity-60 w-[200%] animate-[slide_30s_linear_infinite]">
         {[...Array(25)].map((_, i) => (
            <div key={i} className="bg-indigo-800 w-16 mx-4 relative" style={{ height: `${Math.random() * 60 + 20}%` }}>
               {/* Windows */}
               <div className="absolute top-2 left-2 w-2 h-2 bg-yellow-500 opacity-50"></div>
               <div className="absolute top-8 right-2 w-2 h-2 bg-pink-500 opacity-50"></div>
            </div>
         ))}
      </div>
      
      <style>{`
        @keyframes slide {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
};

export const Floor: React.FC = () => (
  <div className="absolute bottom-0 w-full h-20 bg-slate-900 border-t-4 border-fuchsia-500 z-10">
      {/* Grid effect on floor */}
      <div className="w-full h-full relative overflow-hidden opacity-30">
        <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_49%,#d946ef_50%,transparent_51%)] bg-[length:100px_100%] animate-[slide_2s_linear_infinite]"></div>
      </div>
  </div>
);