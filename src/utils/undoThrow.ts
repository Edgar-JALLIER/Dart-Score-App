import { GameState, Player } from "../types/game";

export const calculateAverage = (throws: number[]) => {
  return throws.length > 0
    ? throws.reduce((sum, throwScore) => sum + throwScore, 0) / throws.length
    : 0;
};

// fonction pour passer au joueur suivant
export const switchToNextPlayer = (
  prevState: GameState,
  players: Player[],
  currentPlayer: number
): GameState => {
  const nextPlayer = (currentPlayer + 1) % players.length;

  return {
    ...prevState,
    players,
    currentPlayerIndex: nextPlayer,
    currentThrow: 0, // Réinitialiser les lancers pour le nouveau joueur
  };
};
