import { GameState } from "../../types/game";
import { GameAction } from "../../interfaces/gameActions";
import {
  checkValidThrow,
  checkVictory,
} from "../../functions/closestPlayerToWin";
import { applyThrowActions } from "./bustedActions";

export const handleSubmitScore = (
  state: GameState,
  action: Extract<GameAction, { type: "SUBMIT_SCORE" }>
): GameState => {
  const { points, isDouble, isTriple } = action.payload;
  const players = [...state.players];
  const currentPlayer = players[state.currentPlayerIndex];

  // // Recalculer la suggestion
  // const throwsLeft =
  //   state.gameType.maxThrowsPerTurn -
  //   currentPlayer.throws.filter((t) => t.round === state.currentRound).length;
  // const suggestion = findSuggestion(currentPlayer.score, throwsLeft);

  const throwResult = checkValidThrow(
    points,
    isDouble,
    isTriple,
    currentPlayer,
    state.gameType
  );

  if (!throwResult.isValid) {
    currentPlayer.addThrow(
      state.currentRound,
      points,
      isDouble,
      isTriple,
      false
    ); // Ajouter un lancer invalide
    if (throwResult.actions) {
      return applyThrowActions(currentPlayer, throwResult.actions, state);
    }
    return state; // Lancer invalide, pas de modification d'état
  }

  if (throwResult.isValid) {
    // Si le lancé est validé alors le joueur à valider le doubleIn
    if (!currentPlayer.hasStarted) {
      currentPlayer.hasStarted = true; // Valider que le joueur a commencé
    }
    currentPlayer.addThrow(
      state.currentRound,
      points,
      isDouble,
      isTriple,
      true
    ); // Ajouter un lancer valide
  }

  // Gérer le lancer (valide ou invalide)
  // let newState = handleThrow(state, points, isDouble, isTriple);

  let newState = checkVictory(state, currentPlayer);

  // Mettre à jour l'état des joueurs
  players[state.currentPlayerIndex] = currentPlayer;

  // Si le jeu est terminé, retourne immédiatement l'état
  if (newState.isFinished) {
    return newState;
  }

  // Retourner le nouvel état
  return { ...newState, players };
};

export const handleNextPlayer = (
  state: GameState,
  action: Extract<GameAction, { type: "NEXT_PLAYER" }>
): GameState => {
  const { maxThrowsPerTurn } = action.payload;
  const players = [...state.players];
  const currentPlayer = players[state.currentPlayerIndex];

  const throwsThisTurn = currentPlayer.throws.filter(
    (t) => t.round === state.currentRound
  ).length;

  let nextPlayerIndex = state.currentPlayerIndex;
  let nextRound = state.currentRound;

  if (state.isFinished) {
    return state; // Pas de transition si la partie est finie
  }
  if (throwsThisTurn >= maxThrowsPerTurn && !state.isFinished) {
    // Enregistrer le score restant du joueur à la fin de ce round
    currentPlayer.recordRoundScore();
    nextPlayerIndex = (state.currentPlayerIndex + 1) % players.length;
    if (nextPlayerIndex === 0) {
      nextRound += 1; // Nouveau round après un cycle complet
    }
  }

  return {
    ...state,
    currentPlayerIndex: nextPlayerIndex,
    currentRound: nextRound,
    currentThrow: 0,
  };
};

export const handleUndoLastThrow = (state: GameState): GameState => {
  const players = [...state.players];
  let currentPlayerIndex = state.currentPlayerIndex;
  let currentRound = state.currentRound;

  // Fonction pour trouver le joueur précédent
  const findPreviousPlayer = () => {
    let newPlayerIndex =
      (currentPlayerIndex - 1 + players.length) % players.length;

    // Si on revient au dernier joueur, on diminue le round
    if (newPlayerIndex === players.length - 1) {
      currentRound -= 1;
    }
    return newPlayerIndex;
  };

  while (true) {
    const currentPlayer = players[currentPlayerIndex];

    // Trouver les lancers dans le round actuel du joueur
    const currentThrows = currentPlayer.throws.filter(
      (throwData) => throwData.round === currentRound
    );

    if (currentThrows.length > 0) {
      // Supprimer le dernier lancer du round actuel
      currentPlayer.removeLastThrow(
        state.gameType.initialScore,
        state.gameType.requireDoubleToStart
      );
      // Supprimer le score de round lorsque l'on revient au joueur précédent
      if (currentThrows.length === state.gameType.maxThrowsPerTurn) {
        currentPlayer.deleteLastRoundScore();
      }
      // Sortir de la boucle après avoir annulé un lancer
      break;
    } else {
      // Si le joueur n'a pas de lancer dans ce round, passer au joueur précédent
      currentPlayerIndex = findPreviousPlayer();

      // Si nous avons fait le tour et que tous les joueurs et rounds sont vides, on arrête
      if (currentRound < 1) {
        console.log("Aucun lancer à annuler.");
        return state; // Rien à annuler
      }
    }
  }

  return {
    ...state,
    players,
    currentPlayerIndex,
    currentRound,
  };
};

export const handleCheckGameFinished = (state: GameState): GameState => {
  const isFinished = state.players.some((player) => player.score === 0);
  const winner = isFinished
    ? state.players.reduce((prev, curr) =>
        prev.score <= curr.score ? prev : curr
      )
    : null;

  return {
    ...state,
    isFinished,
    winner,
  };
};
