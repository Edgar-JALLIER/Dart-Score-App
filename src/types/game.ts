export type Player = {
  id: string;
  name: string;
  score: number;
  throws: number[];
  average: number;
};

export type GameType = "501" | "301" | "Cricket";

export type GameState = {
  players: Player[];
  currentPlayer: number;
  gameType: GameType;
  isFinished: boolean;
};
