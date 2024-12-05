export class Player {
  id: string;
  name: string;
  score: number;
  throws: Throw[];
  average?: number;
  hasStarted: boolean;

  constructor(
    id: string,
    name: string,
    initialScore: number,
    requireDoubleToStart: boolean
  ) {
    this.id = id;
    this.name = name;
    this.score = initialScore;
    this.throws = [];
    this.average = 0;
    this.hasStarted = requireDoubleToStart;
  }

  addThrow(round: number, points: number): void {
    this.throws.push({ round, points });
    this.score -= points; // Le score diminue avec chaque lancer
    this.updateAverage();
  }

  removeLastThrow(initialScore: number, doubleIn: boolean): Throw | undefined {
    const lastThrow = this.throws.pop();
    if (lastThrow) {
      this.score += lastThrow.points; // Réajuster le score en annulant le dernier lancer
      this.updateAverage();
      if (this.score === initialScore && doubleIn) {
        this.hasStarted = false;
      }
    }
    return lastThrow;
  }

  getRoundScore(round: number): number {
    return this.throws
      .filter((t) => t.round === round)
      .reduce((acc, t) => acc + t.points, 0);
  }

  completeThrows(round: number, maxThrowsPerTurn: number): void {
    const throwsInRound = this.throws.filter((t) => t.round === round);
    const remainingThrows = maxThrowsPerTurn - throwsInRound.length;
    for (let i = 0; i < remainingThrows; i++) {
      this.addThrow(round, 0); // Ajouter des lancers de 0 pour compléter
    }
  }

  // Calculer la moyenne des lancers
  private updateAverage(): void {
    const totalPoints = this.throws.reduce(
      (sum, throwData) => sum + throwData.points,
      0
    );
    this.average =
      this.throws.length > 0 ? totalPoints / this.throws.length : 0;
  }
}

export type Throw = {
  round: number;
  points: number;
  isDouble?: boolean;
  isTriple?: boolean;
};

export type GameState = {
  gameType: GameType;
  players: Player[];
  currentRound: number;
  currentPlayerIndex: number;
  currentThrow?: number;
  isFinished: boolean;
  winner: Player | null;
};

export type GameType = {
  id: string; // Identifiant unique du type de jeu
  name: string; // Nom lisible pour l'interface utilisateur
  initialScore: number; // Score initial pour chaque joueur
  requireDoubleToStart: boolean; // Nécessité de commencer avec un double
  requireDoubleToEnd: boolean; // Nécessité de finir avec un double
  maxThrowsPerTurn: number; // Nombre de lancers par tour
  maxRounds?: number; // Nombre de rounds avant la fin du jeu
};

export type Action =
  | {
      type: "SUBMIT_SCORE";
      payload: { points: number; isDouble?: boolean; isTriple?: boolean };
    }
  | { type: "UNDO_LAST_THROW" }
  | { type: "NEXT_PLAYER"; payload: { maxThrowsPerTurn: number } }
  | { type: "INCREMENT_THROW" }
  | { type: "SET_PLAYER_SCORE"; playerIndex: number; score: number }
  | {
      type: "CHECK_GAME_FINISHED";
    };
