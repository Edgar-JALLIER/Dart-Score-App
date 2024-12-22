import { GameState, Player, ThrowAction } from "../../types/game";

export function applyThrowActions(
  currentPlayer: Player,
  actions: ThrowAction[],
  state: GameState
): GameState {
  let updatedState = { ...state };
  const { maxThrowsPerTurn } = updatedState.gameType;

  actions.forEach((action) => {
    switch (action) {
      case "SKIP_TURN":
        currentPlayer.completeThrows(state.currentRound, maxThrowsPerTurn);
        break;
      case "ROLLBACK_ROUND":
        currentPlayer.throws = currentPlayer.throws.filter(
          (t) => t.round !== updatedState.currentRound
        );
        break;
      case "RESTORE_PREVIOUS_SCORE":
        currentPlayer.cancelRoundScore();
        break;
    }
  });

  return updatedState;
}
