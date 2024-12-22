import {
  handleCheckGameFinished,
  handleNextPlayer,
  handleSubmitScore,
  handleUndoLastThrow,
} from "../utils/501/allFunctions";
import { GameState } from "./game";
import { GameAction } from "../interfaces/gameActions";

export const gameReducer = (
  state: GameState,
  action: GameAction
): GameState => {
  switch (action.type) {
    case "SET_SUGGESTION":
      return {
        ...state,
        suggestion: action.suggestion, // Mettre à jour la suggestion dans l'état
      };
    case "SUBMIT_SCORE":
      return handleSubmitScore(state, action);

    case "NEXT_PLAYER":
      return handleNextPlayer(state, action);

    case "UNDO_LAST_THROW":
      return handleUndoLastThrow(state);

    case "CHECK_GAME_FINISHED":
      return handleCheckGameFinished(state);

    default:
      return state;
  }
};
