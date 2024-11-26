export type Player = {
  id: string;
  name: string;
  score: number;
  throws: number[];
  average: number;
  hasStarted: boolean;
};

export type GameType = {
  id: string; // Identifiant unique du type de jeu
  name: string; // Nom lisible pour l'interface utilisateur
  initialScore: number; // Score initial pour chaque joueur
  requireDoubleToStart: boolean; // Nécessité de commencer avec un double
  requireDoubleToEnd: boolean; // Nécessité de finir avec un double
  maxThrowsPerTurn: number; // Nombre de lancers par tour
};

export type GameState = {
  players: Player[];
  currentPlayer: number;
  currentThrow: number;
  gameType: GameType;
  isFinished: boolean;
};
