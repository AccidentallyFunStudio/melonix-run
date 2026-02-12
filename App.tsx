import React, { useState } from 'react';
import { GameCanvas } from './components/GameCanvas';
import { CityBackground, Floor } from './components/Background';
import { GameState, ScoreBoard } from './types';
import { MelodyIcon } from './components/MelodyIcon';
import { gameAudio } from './audio';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>('START');
  const [score, setScore] = useState<ScoreBoard>({ current: 0, best: 0, collected: 0 });
  const [health, setHealth] = useState(3);
  const [isMuted, setIsMuted] = useState(false);

  const startGame = async () => {
    // IMPORTANT: Call audio start immediately within the event handler to unlock Mobile Audio
    await gameAudio.startMusic();
    setGameState('PLAYING');
    setHealth(3);
  };

  const toggleMute = () => {
    const muted = gameAudio.toggleMute();
    setIsMuted(muted);
  };

  const togglePause = async () => {
    if (gameState === 'PLAYING') {
      setGameState('PAUSED');
      await gameAudio.pauseMusic();
    } else if (gameState === 'PAUSED') {
      // Unlock audio again on resume, just in case
      await gameAudio.startMusic();
      setGameState('PLAYING');
    }
  };

  const quitGame = () => {
      setGameState('START');
      gameAudio.stopMusic();
  };

  return (
    <div className="relative w-full h-screen bg-slate-900 overflow-hidden select-none touch-none">
      <div className="scanlines"></div>
      
      {/* Background Layers */}
      <CityBackground />
      <Floor />

      {/* Main Game Layer */}
      <GameCanvas 
        gameState={gameState} 
        setGameState={setGameState} 
        onScoreUpdate={setScore}
        onHealthUpdate={setHealth}
      />

      {/* HUD (Heads Up Display) */}
      <div className="absolute top-0 left-0 w-full p-4 z-40 flex justify-between items-start pointer-events-none">
        
        {/* Score Card */}
        <div className="border-4 border-fuchsia-500 bg-slate-900/80 p-2 md:p-4 rounded-lg shadow-[0_0_15px_#d946ef] text-fuchsia-300 transform scale-90 origin-top-left md:scale-100">
          <div className="text-xl md:text-2xl leading-none mb-2">SCORE: {score.current.toString().padStart(6, '0')}</div>
          <div className="text-lg text-cyan-400">MELODIES: {score.collected}</div>
        </div>

        {/* Health, Audio & Character Info */}
        <div className="flex flex-col items-end space-y-2 pointer-events-auto">
           {/* Controls Row */}
           <div className="flex items-center space-x-2">
             
             {/* Pause Button */}
             {gameState !== 'START' && gameState !== 'GAMEOVER' && (
                 <button 
                    onClick={togglePause}
                    className="w-10 h-10 bg-slate-800 border-2 border-fuchsia-400 rounded-lg flex items-center justify-center text-fuchsia-400 hover:bg-slate-700 active:scale-95 transition-all shadow-[0_0_10px_#d946ef]"
                 >
                    {gameState === 'PAUSED' ? (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                           <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clipRule="evenodd" />
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                           <path fillRule="evenodd" d="M6.75 5.25a.75.75 0 0 1 .75-.75H9a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75H7.5a.75.75 0 0 1-.75-.75V5.25Zm7.5 0A.75.75 0 0 1 15 4.5h1.5a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75H15a.75.75 0 0 1-.75-.75V5.25Z" clipRule="evenodd" />
                        </svg>
                    )}
                 </button>
             )}

             {/* Mute Button */}
             <button 
                onClick={toggleMute}
                className="w-10 h-10 bg-slate-800 border-2 border-cyan-400 rounded-lg flex items-center justify-center text-cyan-400 hover:bg-slate-700 active:scale-95 transition-all shadow-[0_0_10px_#06b6d4]"
             >
                {isMuted ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 9.75 19.5 12m0 0 2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6 4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" />
                  </svg>
                )}
             </button>
             
             {/* Hearts */}
             <div className="flex space-x-1">
               {[...Array(3)].map((_, i) => (
                 <div key={i} className={`w-8 h-8 transition-opacity ${i < health ? 'opacity-100' : 'opacity-20 grayscale'}`}>
                   <svg viewBox="0 0 24 24" fill="#db2777" className="drop-shadow-[0_0_5px_rgba(219,39,119,0.8)]">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                   </svg>
                 </div>
               ))}
             </div>
           </div>
           
           {/* Character Badge */}
           <div className="border-2 border-cyan-400 rounded-full p-1 bg-slate-800/80 flex items-center space-x-2 pr-4 shadow-[0_0_10px_#06b6d4]">
              <div className="w-10 h-10 bg-indigo-900 rounded-full flex items-center justify-center overflow-hidden border border-white">
                  {/* Mini icon of Cheri or Note */}
                  <div className="w-6 h-6"><MelodyIcon /></div>
              </div>
              <span className="text-cyan-300 font-bold tracking-widest text-sm">CHERI</span>
           </div>
        </div>
      </div>

      {/* PAUSE OVERLAY */}
      {gameState === 'PAUSED' && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-slate-900/60 backdrop-blur-sm animate-fade-in">
             <div className="bg-slate-900 border-4 border-fuchsia-500 p-8 rounded-xl shadow-[0_0_30px_#d946ef] flex flex-col items-center space-y-6">
                 <div className="text-4xl text-fuchsia-300 font-bold tracking-widest">PAUSED</div>
                 <div className="flex flex-col space-y-4 w-48">
                     <button 
                        onClick={togglePause}
                        className="w-full px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded shadow-lg border-b-4 border-cyan-800 active:border-b-0 active:translate-y-1 transition-all"
                     >
                        RESUME
                     </button>
                     <button 
                        onClick={quitGame}
                        className="w-full px-6 py-3 bg-slate-700 hover:bg-slate-600 text-slate-300 font-bold rounded shadow-lg border-b-4 border-slate-900 active:border-b-0 active:translate-y-1 transition-all"
                     >
                        QUIT
                     </button>
                 </div>
             </div>
        </div>
      )}

      {/* START OVERLAY */}
      {gameState === 'START' && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-slate-900/90 backdrop-blur-sm animate-fade-in">
          <div className="text-6xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-fuchsia-300 to-fuchsia-600 drop-shadow-[0_4px_0_#4a044e] mb-8 text-center leading-tight">
            MELONIX<br/>RUN
          </div>
          <div className="text-cyan-400 mb-12 text-center text-xl animate-pulse">
            HELP CHERI COLLECT THE MUSIC!
          </div>
          <button 
            onClick={startGame}
            className="group relative px-8 py-4 bg-transparent overflow-hidden rounded-md border-2 border-fuchsia-500 text-fuchsia-500 text-2xl font-bold hover:text-white hover:bg-fuchsia-500 transition-all duration-300 shadow-[0_0_20px_rgba(217,70,239,0.4)] hover:shadow-[0_0_40px_rgba(217,70,239,0.8)] pointer-events-auto"
          >
            <span className="relative z-10">START GAME</span>
          </button>
          <div className="mt-8 text-slate-500 text-sm">TAP SCREEN TO JUMP</div>
        </div>
      )}

      {/* GAME OVER OVERLAY */}
      {gameState === 'GAMEOVER' && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/90 backdrop-blur-md">
          <div className="text-red-500 text-6xl font-bold mb-4 drop-shadow-[2px_2px_0_#fff]">GAME OVER</div>
          <div className="text-white text-2xl mb-8">SCORE: {score.current}</div>
          <button 
            onClick={startGame}
            className="px-8 py-3 bg-cyan-600 text-white rounded hover:bg-cyan-500 font-bold text-xl border-b-4 border-cyan-800 active:border-b-0 active:translate-y-1 transition-all pointer-events-auto"
          >
            TRY AGAIN
          </button>
        </div>
      )}
    </div>
  );
};

export default App;