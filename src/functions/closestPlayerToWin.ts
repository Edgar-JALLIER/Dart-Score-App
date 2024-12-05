import { Player } from "../types/game";

export const closestPlayerToWin = (players: Player[]): Player | null => {
  // Filtrer les joueurs ayant des scores >= 0
  const validPlayers = players.filter((player) => player.score >= 0);

  if (validPlayers.length === 0) {
    return null; // Aucun joueur valide
  }

  // Trouver le joueur avec le score le plus proche de 0
  return validPlayers.reduce((closest, player) => {
    return player.score < closest.score ? player : closest;
  }, validPlayers[0]); // Fournir le premier joueur comme valeur initiale
};
