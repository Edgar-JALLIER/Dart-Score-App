import {
  handleCheckGameFinished,
  handleNextPlayer,
  handleSubmitScore,
  handleUndoLastThrow,
} from "../functions/functionsInGame/501/allFunctions";
import { Action, GameState } from "./game";

export const gameReducer = (state: GameState, action: Action): GameState => {
  switch (action.type) {
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
