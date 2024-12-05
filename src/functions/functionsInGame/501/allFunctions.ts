import { Action, GameState } from "../../../types/game";

export const handleSubmitScore = (
  state: GameState,
  action: Extract<Action, { type: "SUBMIT_SCORE" }>
): GameState => {
  const { points, isDouble } = action.payload;
  const players = [...state.players];
  const currentPlayer = players[state.currentPlayerIndex];

  // Vérifier si le score devient négatif après soustraction
  if (currentPlayer.score - points < 0) {
    console.log("Lancer invalide : dépassement du score.");
    return state; // Annule l'action
  }

  // Règle : Commencer par un double
  if (state.gameType.requireDoubleToStart && !currentPlayer.hasStarted) {
    if (!isDouble) {
      console.log("Le joueur doit commencer par un double.");
      currentPlayer.addThrow(state.currentRound, 0);
      return state; // Lancer invalide, pas de modification d'état
    }
    currentPlayer.hasStarted = true; // Valider que le joueur a commencé
  }

  // Ajouter le lancer au joueur
  currentPlayer.addThrow(state.currentRound, points);

  // Vérifier si la partie est terminée (ajustez selon vos règles)
  if (currentPlayer.score === 0 && !state.gameType.requireDoubleToEnd) {
    return { ...state, players, isFinished: true };
    // currentPlayer.completeThrows(
    //   state.currentRound,
    //   state.gameType.maxThrowsPerTurn
    // );
  }

  // Mettre à jour l'état des joueurs
  players[state.currentPlayerIndex] = currentPlayer;

  // Retourner le nouvel état
  return { ...state, players };
};

export const handleNextPlayer = (
  state: GameState,
  action: Extract<Action, { type: "NEXT_PLAYER" }>
): GameState => {
  const { maxThrowsPerTurn } = action.payload;
  const players = [...state.players];
  const currentPlayer = players[state.currentPlayerIndex];

  const throwsThisTurn = currentPlayer.throws.filter(
    (t) => t.round === state.currentRound
  ).length;

  let nextPlayerIndex = state.currentPlayerIndex;
  let nextRound = state.currentRound;

  if (throwsThisTurn >= maxThrowsPerTurn && !state.isFinished) {
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
