import { Action, GameState } from "./game";

export const gameReducer = (state: GameState, action: Action): GameState => {
  switch (action.type) {
    case "SUBMIT_SCORE": {
      const { points } = action.payload;
      const players = [...state.players];
      const currentPlayer = players[state.currentPlayerIndex];

      // Ajouter les points à l'historique des lancées et mettre à jour le score
      const updatedThrows = [
        ...currentPlayer.throws,
        { round: state.currentRound, points },
      ];
      const updatedScore = currentPlayer.score - points;

      players[state.currentPlayerIndex] = {
        ...currentPlayer,
        throws: updatedThrows,
        score: updatedScore,
      };

      return {
        ...state,
        players,
        currentThrow: (state.currentThrow ?? 0) + 1,
      };
    }

    case "NEXT_PLAYER": {
      const { maxThrowsPerTurn } = action.payload;
      const currentPlayer = state.players[state.currentPlayerIndex];
      const throwsThisTurn = currentPlayer.throws.filter(
        (t) => t.round === state.currentRound
      ).length;

      // Si le joueur a atteint le nombre max de lancers, passer au suivant
      let nextPlayerIndex = state.currentPlayerIndex;
      let nextRound = state.currentRound;

      if (throwsThisTurn >= maxThrowsPerTurn) {
        nextPlayerIndex = (state.currentPlayerIndex + 1) % state.players.length;
        if (nextPlayerIndex === 0) {
          nextRound += 1; // Incrémenter le round si on boucle sur le premier joueur
        }
      }

      return {
        ...state,
        currentPlayerIndex: nextPlayerIndex,
        currentRound: nextRound,
        currentThrow: 0,
      };
    }

    case "UNDO_LAST_THROW": {
      console.log("UNDO_LAST_THROW");
      const players = [...state.players];
      let currentPlayerIndex = state.currentPlayerIndex;
      let currentRound = state.currentRound;

      // Fonction pour trouver le joueur précédent dans un round précédent
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
          const lastThrow = currentPlayer.throws.pop();

          // Réajuster le score du joueur
          players[currentPlayerIndex] = {
            ...currentPlayer,
            score: currentPlayer.score + (lastThrow?.points ?? 0),
          };

          // Si un lancer a été annulé, on sort de la boucle
          break;
        } else {
          // Si le joueur n'a pas de lancer dans ce round, passer au joueur précédent
          currentPlayerIndex = findPreviousPlayer();

          // Si nous avons fait le tour et que tous les joueurs et rounds sont vides, on arrête
          if (currentRound < 1) {
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
    }

    // case "UNDO_LAST_THROW": {
    //   const currentPlayer = state.players[state.currentPlayerIndex];
    //   let currentTurn = currentPlayer.throws[currentPlayer.throws.length - 1];

    //   // Si le dernier tour est vide, passer au joueur précédent
    //   if (!currentTurn || currentTurn.length === 0) {
    //     const previousPlayerIndex =
    //       (state.currentPlayerIndex - 1 + state.players.length) %
    //       state.players.length;
    //     return {
    //       ...state,
    //       currentPlayerIndex: previousPlayerIndex,
    //       currentThrow: state.gameType.maxThrowsPerTurn - 1, // Revenir au dernier lancer du joueur précédent
    //     };
    //   }

    //   // Annuler le dernier lancer du tour actuel
    //   currentTurn.pop();

    //   // Mettre à jour le score et recalculer la moyenne
    //   const updatedPlayer = {
    //     ...currentPlayer,
    //     score: currentPlayer.score + (currentTurn[currentTurn.length - 1] || 0), // Restaurer le dernier score annulé
    //     average: calculateAverage(currentPlayer.throws.flat()), // Recalculer la moyenne sur tous les lancers
    //   };

    //   const updatedPlayers = state.players.map((player, index) =>
    //     index === state.currentPlayerIndex ? updatedPlayer : player
    //   );

    //   return {
    //     ...state,
    //     players: updatedPlayers,
    //     currentThrow: currentTurn.length - 1, // Ajuster le nombre de lancers
    //   };
    // }

    // case "INCREMENT_THROW": {
    //   // Incrémenter le nombre de lancers pour le joueur actuel
    //   return {
    //     ...state,
    //     currentThrow: state.currentThrow + 1,
    //   };
    // }

    // case "SET_PLAYER_SCORE": {
    //   const updatedPlayers = state.players.map((player, index) =>
    //     index === action.playerIndex
    //       ? { ...player, score: action.score }
    //       : player
    //   );
    //   return {
    //     ...state,
    //     players: updatedPlayers,
    //   };
    // }

    default:
      return state;
  }
};
