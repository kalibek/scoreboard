export interface Score {
  move: number;
  turn: number;
  word: string;
  score: number;
}


export interface Player {
  ord: number;
  name: string;
}

export interface Game {
  gameId: string;
  players: Player[];
  gameStarted: boolean;
  turn: number;
  move: number;
  scores: Score[];
  readonly: boolean;
  date: string;
}

export interface ScoreSum {
  turn: number;
  sum: number;
}

