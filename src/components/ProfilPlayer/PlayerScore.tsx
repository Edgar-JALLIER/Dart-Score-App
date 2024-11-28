import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { GameState } from "../../types/game";

type PlayerScoreProps = Readonly<{
  playerScoreGame: GameState;
}>;

export function PlayerScore({ playerScoreGame }: PlayerScoreProps) {
  const { players, currentPlayerIndex, currentRound, gameType } =
    playerScoreGame;

  return (
    <ScrollView style={styles.scrollView}>
      {players.map((player, index) => {
        const isActive = index === currentPlayerIndex;
        return (
          <View
            key={player.id}
            style={[styles.container, isActive && styles.activeContainer]}
          >
            <Text style={styles.playerName}>
              {player.name} - Score : {player.score}
            </Text>

            {/* Affichage des cases de lancers */}
            <View style={styles.throwsContainer}>
              {/* Créer une case pour chaque lancer possible */}
              {Array.from({ length: gameType.maxThrowsPerTurn }).map(
                (_, index) => {
                  // Si c'est le joueur actuel, on affiche les lancers du round actuel
                  const isCurrentPlayer =
                    player.id === players[currentPlayerIndex].id;

                  let throwData;

                  if (isCurrentPlayer) {
                    // Filtrer les lancées du round actuel pour le joueur actif
                    throwData = player.throws.filter(
                      (t) => t.round === currentRound
                    )[index];
                  } else {
                    // Pour les autres joueurs, afficher les lancers du dernier round
                    const lastRound = Math.max(
                      ...player.throws.map((t) => t.round)
                    );
                    throwData = player.throws.filter(
                      (t) => t.round === lastRound
                    )[index];
                  }

                  return (
                    <View
                      key={index + 1}
                      style={[
                        styles.throwBox,
                        throwData ? styles.filledThrow : styles.emptyThrow,
                      ]}
                    >
                      <Text style={styles.throwText}>
                        {throwData ? throwData.points : ""}
                      </Text>
                    </View>
                  );
                }
              )}
            </View>

            {/* Afficher la moyenne */}
            <Text style={styles.playerAverage}>
              Moyenne :{" "}
              {player.average !== undefined ? player.average.toFixed(2) : "N/A"}
            </Text>

            <Text style={styles.playerStatus}>
              {player.hasStarted
                ? "A commencé à scorer"
                : "Pas encore commencé"}
            </Text>
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    padding: 20,
    paddingTop: 0,
    flex: 1,
    marginBottom: 16,
  },
  container: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: "#333",
  },
  activeContainer: {
    backgroundColor: "#6200ea",
  },

  playerThrows: {
    fontSize: 14,
    color: "#fff",
    marginTop: 4,
  },
  playerAverage: {
    fontSize: 14,
    color: "#fff",
    marginTop: 4,
  },
  playerName: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  score: {
    color: "white",
    fontSize: 24,
  },
  average: {
    color: "#ccc",
    fontSize: 14,
  },
  playerStatus: {
    fontSize: 14,
    color: "#999",
    marginTop: 5,
    fontStyle: "italic",
  },

  throwsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    columnGap: 15,
    justifyContent: "center",
    alignContent: "center",
    marginTop: 10,
  },
  throwBox: {
    width: 30, // Taille des cases
    height: 30,
    marginRight: 5,
    marginBottom: 5,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 5,
  },
  filledThrow: {
    backgroundColor: "#4caf50", // Vert pour les cases remplies
  },
  emptyThrow: {
    backgroundColor: "#ccc", // Gris pour les cases vides
  },
  throwText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
