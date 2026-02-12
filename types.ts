export type GameState = 'START' | 'PLAYING' | 'PAUSED' | 'GAMEOVER';

export interface Entity {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'melody' | 'obstacle';
  collected?: boolean;
}

export interface PlayerState {
  y: number;
  velocity: number;
  isJumping: boolean;
}

export interface ScoreBoard {
  current: number;
  best: number;
  collected: number;
}