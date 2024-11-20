import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Player } from "../../types/game";

type PlayerScoreProps = Readonly<{
  player: Player;
  isActive: boolean;
}>;

export function PlayerScore({ player, isActive }: PlayerScoreProps) {
  return (
    <View style={[styles.container, isActive && styles.activeContainer]}>
      <Text style={styles.playerName}>{player.name}</Text>
      <Text style={styles.score}>Score: {player.score}</Text>
      <Text style={styles.average}>Moyenne: {player.average.toFixed(1)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: "#333",
  },
  activeContainer: {
    backgroundColor: "#4CAF50",
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
});
