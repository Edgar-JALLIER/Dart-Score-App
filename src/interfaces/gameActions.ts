import { Suggestion, ThrowAction } from "../types/game";

export type GameAction =
  | SubmitScoreAction
  | UndoLastThrowAction
  | NextPlayerAction
  | IncrementThrowAction
  | SetPlayerScoreAction
  | CheckGameFinishedAction
  | SetSuggestionAction;

interface SubmitScoreAction {
  type: "SUBMIT_SCORE";
  payload: { points: number; isDouble: boolean; isTriple: boolean };
}

interface UndoLastThrowAction {
  type: "UNDO_LAST_THROW";
}

interface NextPlayerAction {
  type: "NEXT_PLAYER";
  payload: { maxThrowsPerTurn: number };
}

interface IncrementThrowAction {
  type: "INCREMENT_THROW";
}

interface SetPlayerScoreAction {
  type: "SET_PLAYER_SCORE";
  playerIndex: number;
  score: number;
}

interface CheckGameFinishedAction {
  type: "CHECK_GAME_FINISHED";
}

interface SetSuggestionAction {
  type: "SET_SUGGESTION";
  suggestion: Suggestion[] | null;
}

export interface ThrowResult {
  isValid: boolean;
  reason?: string;
  actions?: ThrowAction[];
}
