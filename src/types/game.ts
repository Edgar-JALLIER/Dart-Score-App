export type Player = {
  id: string;
  name: string;
  score: number;
  throws: Throw[];
  average?: number;
  hasStarted?: boolean;
};

export type Throw = {
  round: number;
  points: number;
};

export type GameState = {
  gameType: GameType;
  players: Player[];
  currentRound: number;
  currentPlayerIndex: number;
  currentThrow?: number;
  isFinished: boolean;
};

export type GameType = {
  id: string; // Identifiant unique du type de jeu
  name: string; // Nom lisible pour l'interface utilisateur
  initialScore: number; // Score initial pour chaque joueur
  requireDoubleToStart: boolean; // Nécessité de commencer avec un double
  requireDoubleToEnd: boolean; // Nécessité de finir avec un double
  maxThrowsPerTurn: number; // Nombre de lancers par tour
};

export type Action =
  | { type: "UNDO_LAST_THROW" }
  | { type: "SUBMIT_SCORE"; payload: { points: number } }
  | { type: "NEXT_PLAYER"; payload: { maxThrowsPerTurn: number } }
  | { type: "INCREMENT_THROW" }
  | { type: "SET_PLAYER_SCORE"; playerIndex: number; score: number };

export const initialState: GameState = {
  players: [
    { id: "1", name: "Player 1", score: 501, throws: [] },
    { id: "2", name: "Player 2", score: 501, throws: [] },
  ],
  currentPlayerIndex: 0,
  isFinished: false,
};
