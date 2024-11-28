import React, { useEffect, useReducer } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
  StatusBar,
  BackHandler,
} from "react-native";
import ScoreInput from "../components/InGame/ScoreInput";
import { PlayerScore } from "../components/ProfilPlayer/PlayerScore";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { HeaderBackButton } from "@react-navigation/elements";
import { gameReducer } from "../types/gameReducer";

type Props = NativeStackScreenProps<RootStackParamList, "Game">;

const GameScreen: React.FC<Props> = ({ route, navigation }) => {
  const [state, dispatch] = useReducer(gameReducer, {
    players: route.params?.players || [],
    currentRound: 1,
    currentPlayerIndex: 0,
    currentThrow: 0,
    gameType: route.params.mode,
    isFinished: false,
  });

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      handleBackPress
    );
    return () => backHandler.remove(); // Nettoie l'écouteur lorsque le composant est démonté
  }, []);
  // Gestion de la touche retour pour quitter la partie
  const handleBackPress = () => {
    Alert.alert(
      "Quitter la partie",
      "Êtes-vous sur de vouloir quitter la partie ?",
      [
        { text: "Annuler" },
        {
          text: "Oui",
          onPress: () => navigation.goBack(),
        },
      ]
    );
    return true;
  };
  const handleScoreSubmit = (
    points: number,
    isDouble: boolean,
    isTriple: boolean
  ) => {
    if (points === -1) {
      dispatch({ type: "UNDO_LAST_THROW" });
      return;
    }
    // Vous pouvez maintenant utiliser isDouble et isTriple ici pour d'autres logiques si nécessaire
    dispatch({ type: "SUBMIT_SCORE", payload: { points } });
    dispatch({
      type: "NEXT_PLAYER",
      payload: { maxThrowsPerTurn: state.gameType.maxThrowsPerTurn },
    });
  };

  return (
    <>
      <StatusBar backgroundColor="#333" barStyle={"light-content"} />
      <SafeAreaView style={styles.safeAreaContainer}>
        <View style={styles.container}>
          <View style={styles.titleContainer}>
            <HeaderBackButton onPress={handleBackPress} tintColor="white" />
            <Text style={styles.titleText}>
              {state.gameType.name} -{" "}
              {state.gameType.requireDoubleToStart
                ? "Double In"
                : "Straight In"}{" "}
              /{" "}
              {state.gameType.requireDoubleToEnd
                ? "Double Out"
                : "Straight Out"}{" "}
            </Text>
            <Text style={styles.titleIcons}>🎯</Text>
          </View>
          <View style={styles.viewRound}>
            <Text style={styles.titleRound}>Round {state.currentRound}</Text>
          </View>
          <PlayerScore playerScoreGame={state} />

          {!state.isFinished ? (
            <ScoreInput onScoreSubmit={handleScoreSubmit} />
          ) : (
            <View style={styles.winnerContainer}>
              <Text style={styles.winnerText}>
                🎯 {state.players[state.currentPlayerIndex].name} a gagné! 🎯
              </Text>
              <TouchableOpacity
                style={styles.homeButton}
                onPress={() => navigation.navigate("Home")}
              >
                <Text style={styles.buttonText}>Retour à l'accueil</Text>
              </TouchableOpacity>

              {/* Bouton pour voir les statistiques */}
              <TouchableOpacity
                style={styles.homeButton}
                onPress={() =>
                  navigation.navigate("Stats", {
                    mode: state.gameType,
                    players: state.players,
                  })
                }
              >
                <Text style={styles.buttonText}>Voir les statistiques</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
    backgroundColor: "#333",
  },
  container: {
    flex: 1,
    backgroundColor: "#1a1a1a",
    padding: 0,
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#333",
  },
  titleIcons: {
    fontSize: 18,
    padding: 10,
  },
  titleText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    paddingHorizontal: 0,
    paddingVertical: 18,
    margin: 0,
  },
  viewRound: {
    height: 30,
    alignItems: "center",
    margin: 10,
  },
  titleRound: {
    color: "white",
    height: "100%",
    backgroundColor: "#6200ea",
    fontSize: 16,
    width: "30%", // Limite la largeur du texte
    fontWeight: "bold",
    textAlign: "center", // Centrer le texte horizontalement
    borderRadius: 5,
    paddingHorizontal: 0,
    paddingVertical: 5,
    margin: 0,
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
    backgroundColor: "#6200ea",
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
