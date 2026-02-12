import React, { useEffect, useRef, useState, useCallback } from 'react';
import { GRAVITY, JUMP_STRENGTH, GROUND_HEIGHT, PLAYER_WIDTH, PLAYER_HEIGHT, ITEM_SIZE, SPAWN_RATE, GAME_SPEED_START } from '../constants';
import { GameState, Entity, PlayerState, ScoreBoard } from '../types';
import { CheriSprite } from './CheriSprite';
import { MelodyIcon, ObstacleIcon } from './MelodyIcon';
import { gameAudio } from '../audio';

interface GameCanvasProps {
  gameState: GameState;
  setGameState: (state: GameState) => void;
  onScoreUpdate: (score: ScoreBoard) => void;
  onHealthUpdate: (health: number) => void;
}

export const GameCanvas: React.FC<GameCanvasProps> = ({ gameState, setGameState, onScoreUpdate, onHealthUpdate }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number>(0);
  
  // Game Logic State
  const player = useRef<PlayerState>({ y: 0, velocity: 0, isJumping: false });
  const items = useRef<Entity[]>([]);
  const frameCount = useRef(0);
  const score = useRef(0);
  const collectedCount = useRef(0);
  const health = useRef(3);
  const gameSpeed = useRef(GAME_SPEED_START);
  const prevGameState = useRef<GameState>('START');

  // React State for Rendering
  const [renderTrigger, setRenderTrigger] = useState(0); 

  // Reset Game
  const resetGame = useCallback(() => {
    player.current = { y: 0, velocity: 0, isJumping: false };
    items.current = [];
    score.current = 0;
    collectedCount.current = 0;
    health.current = 3;
    gameSpeed.current = GAME_SPEED_START;
    frameCount.current = 0;
    onScoreUpdate({ current: 0, best: 0, collected: 0 });
    onHealthUpdate(3);
  }, [onScoreUpdate, onHealthUpdate]);

  // Jump Action
  const handleJump = useCallback(() => {
    if (gameState !== 'PLAYING') return;
    
    if (player.current.y <= 0) {
      player.current.velocity = JUMP_STRENGTH;
      player.current.isJumping = true;
      gameAudio.playJump();
    }
  }, [gameState]);

  // Game Loop
  const update = useCallback(() => {
    if (gameState !== 'PLAYING') return;

    // 1. Physics: Player
    player.current.velocity += GRAVITY;
    player.current.y -= player.current.velocity;

    // Floor collision
    if (player.current.y <= 0) {
      player.current.y = 0;
      player.current.velocity = 0;
      player.current.isJumping = false;
    }

    // 2. Physics: Items (Spawning)
    frameCount.current++;
    if (frameCount.current % SPAWN_RATE === 0 && containerRef.current) {
      const containerWidth = containerRef.current.clientWidth;
      const type = Math.random() > 0.8 ? 'obstacle' : 'melody'; // 20% obstacle chance
      const yPos = type === 'melody' 
        ? Math.random() * 150 + 20 // Melody varies in height
        : 0; // Obstacles are on the ground

      items.current.push({
        id: Date.now() + Math.random(),
        x: containerWidth,
        y: yPos,
        width: ITEM_SIZE,
        height: ITEM_SIZE,
        type: type,
        collected: false
      });
      
      // Gradually increase speed
      if (frameCount.current % 600 === 0) {
         gameSpeed.current += 0.5;
      }
    }

    // 3. Physics: Items (Movement & Collision)
    const playerRect = {
      l: 50 + 10,
      r: 50 + PLAYER_WIDTH - 10,
      t: player.current.y + PLAYER_HEIGHT - 5,
      b: player.current.y + 5
    };

    items.current.forEach(item => {
      item.x -= gameSpeed.current;

      // Collision Detection
      if (!item.collected) {
        const itemRect = {
          l: item.x,
          r: item.x + item.width,
          t: item.y + item.height,
          b: item.y
        };

        const isColliding = !(
            playerRect.r < itemRect.l || 
            playerRect.l > itemRect.r || 
            playerRect.b > itemRect.t || 
            playerRect.t < itemRect.b
        );

        if (isColliding) {
          item.collected = true; 
          if (item.type === 'melody') {
            score.current += 100;
            collectedCount.current += 1;
            gameAudio.playCollect();
          } else {
            health.current -= 1;
            onHealthUpdate(health.current);
            gameAudio.playHit();
          }
        }
      }
    });

    items.current = items.current.filter(item => item.x > -100 && !(item.collected && item.type === 'melody'));

    // 4. Check Game Over
    if (health.current <= 0) {
      setGameState('GAMEOVER');
      gameAudio.stopMusic();
      gameAudio.playGameOver();
    }

    // 5. Update Score
    score.current += 1; // Survival points
    if (frameCount.current % 10 === 0) { 
      onScoreUpdate({ 
        current: score.current, 
        best: 0, 
        collected: collectedCount.current 
      });
      setRenderTrigger(prev => prev + 1); 
    }

    requestRef.current = requestAnimationFrame(update);
  }, [gameState, setGameState, onScoreUpdate, onHealthUpdate]);

  // Start/Stop Loop and Reset Handling
  useEffect(() => {
    if (gameState === 'PLAYING') {
      // If we are coming from START or GAMEOVER, we must reset the game entities.
      // If we are coming from PAUSED, we continue where we left off.
      if (prevGameState.current === 'START' || prevGameState.current === 'GAMEOVER') {
         resetGame();
      }
      
      requestRef.current = requestAnimationFrame(update);
    }
    
    // Update the previous state ref for the next render cycle
    prevGameState.current = gameState;

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [gameState, update, resetGame]);

  // Input Listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.code === 'Space' || e.code === 'ArrowUp') && gameState === 'PLAYING') {
        handleJump();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleJump, gameState]);

  return (
    <div 
      ref={containerRef}
      className="absolute inset-0 z-20 overflow-hidden cursor-pointer"
      onPointerDown={(e) => {
        // Pointer down covers both mouse and touch, and handles preventDefault logic better
        if ((e.target as HTMLElement).tagName !== 'BUTTON') {
           e.preventDefault(); 
           handleJump();
        }
      }}
    >
      {/* Player */}
      <div 
        style={{ 
          position: 'absolute', 
          left: '50px', 
          bottom: `${player.current.y + GROUND_HEIGHT}px`,
          width: `${PLAYER_WIDTH}px`,
          height: `${PLAYER_HEIGHT}px`,
          transition: 'bottom 0.05s linear' 
        }}
      >
        {/* Name Label */}
        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-black/50 px-2 py-0.5 rounded text-[10px] text-cyan-300 font-bold tracking-widest border border-cyan-500/50 whitespace-nowrap z-10 pointer-events-none">
            CHERI
        </div>

        <CheriSprite 
            isRunning={gameState === 'PLAYING'} 
            isJumping={player.current.isJumping} 
        />
        {/* Shadow */}
        <div className="absolute -bottom-4 left-2 w-8 h-2 bg-black opacity-30 rounded-full blur-sm"
             style={{ transform: `scale(${1 - player.current.y/200})` }}
        ></div>
      </div>

      {/* Items */}
      {items.current.map(item => (
        !item.collected || item.type === 'obstacle' ? (
          <div
            key={item.id}
            style={{
              position: 'absolute',
              left: `${item.x}px`,
              bottom: `${item.y + GROUND_HEIGHT}px`,
              width: `${item.width}px`,
              height: `${item.height}px`,
              opacity: item.collected ? 0.5 : 1 
            }}
          >
            {item.type === 'melody' ? <MelodyIcon /> : <ObstacleIcon />}
          </div>
        ) : null
      ))}
      
      {/* Collision Flash Effect */}
      {health.current < 2 && gameState === 'PLAYING' && (
         <div className="absolute inset-0 bg-red-500 opacity-10 pointer-events-none animate-pulse" />
      )}
    </div>
  );
};