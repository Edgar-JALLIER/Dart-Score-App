import React, { useState } from "react";
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { ScoreInput } from "../components/InGame/ScoreInput";
import { PlayerScore } from "../components/ProfilPlayer/PlayerScore";
import { GameState } from "../types/game";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";

type Props = NativeStackScreenProps<RootStackParamList, "Game">;

const GameScreen: React.FC<Props> = ({ route, navigation }) => {
  const [gameState, setGameState] = useState<GameState>({
    players: route.params?.players || [],
    currentPlayer: 0,
    gameType: route.params?.gameType,
    isFinished: false,
  });

  const handleScore = (score: number) => {
    // Mise à jour fonctionnelle de l'état
    setGameState((prevState) => {
      // On clone les joueurs pour ne pas modifier directement l'état
      const newPlayers = [...prevState.players];
      const currentPlayer = { ...newPlayers[prevState.currentPlayer] }; // Clone le joueur actuel

      const newScore = currentPlayer.score - score;
      if (newScore < 0) return prevState; // Ne pas mettre à jour si le score devient négatif

      // On met à jour le score et les autres propriétés de façon immuable
      currentPlayer.throws = [...currentPlayer.throws, score]; // Ajouter le score à la liste des lancers
      currentPlayer.score = newScore;
      currentPlayer.average =
        currentPlayer.throws.reduce((a, b) => a + b, 0) /
        currentPlayer.throws.length;

      // Mettre à jour la liste des joueurs avec le joueur modifié
      newPlayers[prevState.currentPlayer] = currentPlayer;

      // Vérifier si la partie est terminée
      if (newScore === 0) {
        return { ...prevState, players: newPlayers, isFinished: true }; // Terminer la partie
      }

      // Passer au joueur suivant
      const nextPlayer =
        (prevState.currentPlayer + 1) % prevState.players.length;
      return {
        ...prevState,
        players: newPlayers,
        currentPlayer: nextPlayer,
      };
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {gameState.players.map((player, index) => (
          <PlayerScore
            key={player.id}
            player={player}
            isActive={index === gameState.currentPlayer}
          />
        ))}
      </ScrollView>

      {!gameState.isFinished ? (
        <ScoreInput onScoreSubmit={handleScore} />
      ) : (
        <View style={styles.winnerContainer}>
          <Text style={styles.winnerText}>
            🎯 {gameState.players[gameState.currentPlayer].name} a gagné! 🎯
          </Text>
          <TouchableOpacity
            style={styles.homeButton}
            onPress={() => navigation.navigate("Home")}
          >
            <Text style={styles.buttonText}>Retour à l'accueil</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a1a",
    padding: 20,
  },
  scrollView: {
    flex: 1,
    marginBottom: 16,
  },
  winnerContainer: {
    width: "100%",
    padding: 16,
    backgroundColor: "#4CAF50",
    borderRadius: 8,
  },
  winnerText: {
    color: "white",
    fontSize: 20,
    textAlign: "center",
  },
  homeButton: {
    backgroundColor: "#2196F3",
    padding: 12,
    borderRadius: 4,
    marginTop: 16,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default GameScreen;
