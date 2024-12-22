import { Suggestion } from "../../types/game";

export const findSuggestion = (
  currentScore: number,
  throwsLeft: number
): Suggestion[] | null => {
  const possibleThrows: Suggestion[] = [];

  // Générer tous les lancers possibles
  for (let i = 1; i <= 20; i++) {
    possibleThrows.push({ type: "S", value: i }); // Single
    possibleThrows.push({ type: "D", value: i }); // Double
    possibleThrows.push({ type: "T", value: i }); // Triple
  }
  possibleThrows.push({ type: "S", value: 25 }); // Single Bullseye
  possibleThrows.push({ type: "D", value: 25 }); // Double Bullseye

  // **Recherche de solution en 1 lancer**
  if (throwsLeft >= 1) {
    const possibleDouble = possibleThrows.filter(
      (t) => t.type === "D" && t.value * 2 === currentScore
    );

    if (possibleDouble.length > 0) {
      return [possibleDouble[0]]; // Solution trouvée en 1 lancer
    }
  }

  // **Recherche de solution en 2 lancers**
  if (throwsLeft >= 2) {
    for (const first of possibleThrows.filter(
      (t) => t.value >= 20 || t.type === "S"
    )) {
      // Filtrer pour éviter les doubles/triples < 20 ici
      for (const second of possibleThrows.filter((t) => t.type === "D")) {
        const totalPoints =
          first.value * (first.type === "D" ? 2 : first.type === "T" ? 3 : 1) +
          second.value *
            (second.type === "D" ? 2 : second.type === "T" ? 3 : 1);

        if (totalPoints === currentScore) {
          return [first, second]; // Solution trouvée en 2 lancers
        }
      }
    }
  }

  // **Recherche de solution en 3 lancers**
  if (throwsLeft === 3) {
    for (const first of possibleThrows.filter(
      (t) => t.value >= 20 || t.type === "S"
    )) {
      // Filtrer pour éviter les doubles/triples < 20 ici
      for (const second of possibleThrows.filter(
        (t) => t.value >= 20 || t.type === "S"
      )) {
        for (const third of possibleThrows.filter((t) => t.type === "D")) {
          const totalPoints =
            first.value *
              (first.type === "D" ? 2 : first.type === "T" ? 3 : 1) +
            second.value *
              (second.type === "D" ? 2 : second.type === "T" ? 3 : 1) +
            third.value * (third.type === "D" ? 2 : third.type === "T" ? 3 : 1);

          if (totalPoints === currentScore) {
            return [first, second, third]; // Solution trouvée en 3 lancers
          }
        }
      }
    }
  }

  return null; // Aucune solution trouvée
};
