import { ThrowResult } from "../interfaces/gameActions";
import { GameState, GameType, Player } from "../types/game";
import { handleNextPlayer } from "../utils/501/allFunctions";

export const checkValidThrow = (
  points: number,
  isDouble: boolean,
  isTriple: boolean,
  currentPlayer: Readonly<Player>,
  optionsGame: Readonly<GameType>
): ThrowResult => {
  const newPlayerScore = currentPlayer.score - points;

  // Check Double to Start
  if (optionsGame.requireDoubleToStart && !currentPlayer.hasStarted) {
    if (!isDouble) {
      return { isValid: false, reason: "Double required to start" };
    }
    return { isValid: true };
  }

  // Check if the player's score after the throw is negative
  if (newPlayerScore < 0) {
    return {
      isValid: false,
      reason: "Score below 0",
      actions: ["SKIP_TURN", "RESTORE_PREVIOUS_SCORE"],
    };
  }

  // Check if the player's score after the throw is 0
  if (newPlayerScore === 0) {
    if (optionsGame.requireDoubleToEnd && !isDouble) {
      return {
        isValid: false,
        reason: "Double required to end",
        actions: ["SKIP_TURN", "RESTORE_PREVIOUS_SCORE"],
      };
    }
    return { isValid: true };
  }

  // If no rule was violated
  return { isValid: true };
};

export const checkVictory = (
  state: GameState,
  currentPlayer: Player
): GameState => {
  if (currentPlayer.score === 0) {
    // Marquer la fin du jeu, car le joueur a gagné
    return { ...state, isFinished: true, winner: currentPlayer };
  }
  return state;
};

export const handleThrow = (
  state: GameState,
  points: number,
  isDouble: boolean,
  isTriple: boolean
): GameState => {
  const players = [...state.players];
  const currentPlayer = players[state.currentPlayerIndex];

  // Vérification si le score du joueur ne devient pas négatif
  const newScore = currentPlayer.score - points;

  if (newScore < 0) {
    // Si le score devient négatif, lancer invalide
    currentPlayer.addThrow(
      state.currentRound,
      points,
      isDouble,
      isTriple,
      false
    );

    // Ajouter des lancers "0" pour compléter le tour
    const maxThrowsPerTurn = state.gameType.maxThrowsPerTurn;
    const throwsThisTurn = currentPlayer.throws.filter(
      (t) => t.round === state.currentRound
    ).length;

    for (let i = throwsThisTurn; i < maxThrowsPerTurn; i++) {
      currentPlayer.addThrow(state.currentRound, 0, false, false, false);
    }

    // Passer au joueur suivant
    return handleNextPlayer(state, {
      type: "NEXT_PLAYER",
      payload: { maxThrowsPerTurn: state.gameType.maxThrowsPerTurn },
    });
  }

  // Si le score est valide (positif ou 0)
  currentPlayer.addThrow(state.currentRound, points, isDouble, isTriple, true);
  currentPlayer.score = newScore;

  return state;
};

export const closestPlayerToWin = (players: Player[]): Player | null => {
  // Filtrer les joueurs ayant des scores >= 0
  const validPlayers = players.filter((player) => player.score >= 0);

  if (validPlayers.length === 0) {
    return null; // Aucun joueur valide
  }

  // Trouver le joueur avec le score le plus proche de 0
  return validPlayers.reduce((closest, player) => {
    return player.score < closest.score ? player : closest;
  }, validPlayers[0]); // Fournir le premier joueur comme valeur initiale
};
