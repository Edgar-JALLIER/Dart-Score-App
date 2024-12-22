export class Player {
  id: string;
  name: string;
  score: number;
  throws: Throw[];
  scoresByRound: number[];
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
    this.scoresByRound = [];
    this.average = 0;
    this.hasStarted = requireDoubleToStart;
  }

  addThrow(
    round: number,
    points: number,
    isDouble: boolean,
    isTriple: boolean,
    isValid: boolean
  ): void {
    this.throws.push({ round, points, isDouble, isTriple, isValid });

    this.score = isValid ? this.score - points : this.score; // Déduire les points si le lancer est valide
    this.updateAverage();
  }

  removeLastThrow(initialScore: number, doubleIn: boolean): Throw | undefined {
    const lastThrow = this.throws.pop();
    if (lastThrow) {
      // Réajuster le score uniquement si le lancer était valide
      if (lastThrow.isValid) {
        this.score = this.calculateScoreFromThrows(initialScore);
      }
      this.updateAverage();
      if (this.score === initialScore && doubleIn) {
        this.hasStarted = false;
      }
    }
    return lastThrow;
  }

  calculateScoreFromThrows(initialScore: number): number {
    return this.throws
      .filter((throwData) => throwData.isValid) // Ne prendre en compte que les lancers valides
      .reduce((acc, t) => acc - t.points, initialScore);
  }

  recordRoundScore(): void {
    this.scoresByRound.push(this.score); // Enregistrer le score final du round
  }

  deleteLastRoundScore(): void {
    this.scoresByRound.pop(); // Supprimer le score du dernier round
  }

  calculateScore(initialScore: number): void {
    this.score = this.throws
      .filter((t) => t.isValid) // Ne considère que les lancers valides
      .reduce((acc, t) => acc - t.points, initialScore);
  }

  completeThrows(round: number, maxThrowsPerTurn: number): void {
    const throwsInRound = this.throws.filter((t) => t.round === round);
    const remainingThrows = maxThrowsPerTurn - throwsInRound.length;
    for (let i = 0; i < remainingThrows; i++) {
      this.addThrow(round, 0, false, false, true); // Ajouter des lancers de 0 pour compléter
    }
    this.recordRoundScore(); // Enregistrer le score final du round
  }

  cancelRoundScore(): void {
    // Réinitialiser le score au début du round
    this.score = this.scoresByRound.pop() ?? this.score;
  }

  // Calculer la moyenne des lancers
  private updateAverage(): void {
    // Filtrer uniquement les lancers valides
    const validThrows = this.throws.filter((throwData) => throwData.isValid);

    const totalPoints = validThrows.reduce(
      (sum, throwData) => sum + throwData.points,
      0
    );

    this.average =
      validThrows.length > 0 ? totalPoints / validThrows.length : 0;
  }
}

export type Throw = {
  round: number;
  points: number;
  isDouble: boolean;
  isTriple: boolean;
  isValid?: boolean;
};

export type GameState = {
  gameType: GameType;
  players: Player[];
  currentRound: number;
  currentPlayerIndex: number;
  currentThrow?: number;
  isFinished: boolean;
  winner: Player | null;
  suggestion: Suggestion[] | null; // Nouvelle propriété
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

export type ThrowAction =
  | "SKIP_TURN" // Renommer pour plus de clarté
  | "ROLLBACK_ROUND" // Annuler tous les lancers du round
  | "RESTORE_PREVIOUS_SCORE"; // Réinitialiser le score au précédent

export type Suggestion = {
  type: "S" | "D" | "T"; // Single, Double, Triple
  value: number; // La valeur de la cible (1 à 20 ou 25 pour le bullseye)
};
