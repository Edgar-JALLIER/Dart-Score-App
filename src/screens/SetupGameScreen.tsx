import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  Platform,
} from "react-native";
import { StackScreenProps } from "@react-navigation/stack"; // Importez le bon type
import AddNewPlayerButton from "../components/Button/AddNewPlayerButton";
import uuid from "react-native-uuid";
import { Ionicons } from "@expo/vector-icons";
import { RootStackParamList } from "../navigation/AppNavigator";
import BasicButton from "../components/Button/BasicButton";
import { GameType, Player } from "../types/game";
import LineSeparator from "../components/ui/LineSeparator";

type Props = StackScreenProps<RootStackParamList, "Setup Game">;

const SetupGameScreen: React.FC<Props> = ({ route, navigation }) => {
  const [gameType, setGameType] = useState<GameType>({
    id: "501",
    name: "501",
    initialScore: 501,
    requireDoubleToStart: false,
    requireDoubleToEnd: false,
    maxThrowsPerTurn: 3,
  });
  const [numPlayers, setNumPlayers] = useState<number>(2);
  const [players, setPlayers] = useState<Player[]>([]);

  const generatePlayers = (
    numPlayers: number,
    initialScore: number,
    requireDoubleToStart: boolean
  ): Player[] => {
    console.log("requireDOUBLE", requireDoubleToStart);
    const updatedPlayers = Array.from({ length: numPlayers }, (_, index) => {
      const existingPlayer = players[index];
      return existingPlayer
        ? new Player(
            existingPlayer.id,
            existingPlayer.name, // Conserver le nom existant
            initialScore, // Mettre à jour le score initial
            !requireDoubleToStart
          )
        : new Player(
            uuid.v4(),
            "", // Nouveau joueur avec nom vide par défaut
            initialScore,
            !requireDoubleToStart
          );
    });

    return updatedPlayers;
  };

  useEffect(() => {
    const initialPlayers = generatePlayers(
      numPlayers,
      gameType.initialScore,
      gameType.requireDoubleToStart
    );
    setPlayers(initialPlayers);
  }, [numPlayers, gameType]);

  // Ajout d'un nouveau joueur
  const addNewPlayer = () => {
    setNumPlayers((prev) => prev + 1);
  };

  // Modifier le nom d'un joueur
  const handlePlayerNameChange = (name: string, index: number) => {
    setPlayers((prevPlayers) =>
      prevPlayers.map((player, i) =>
        i === index
          ? new Player(player.id, name, player.score, player.hasStarted)
          : player
      )
    );
  };

  // Suppression d’un joueur
  const deletePlayer = (index: number) => {
    setPlayers((prevPlayers) => prevPlayers.filter((_, i) => i !== index));
    setNumPlayers((prev) => prev - 1);
  };

  // Validation et démarrage du jeu
  const startGame = () => {
    const validatedPlayers = players.map(
      (player, index) =>
        new Player(
          player.id,
          player.name.trim() === "" ? `Joueur ${index + 1}` : player.name,
          player.score,
          player.hasStarted
        )
    );
    console.log("player", validatedPlayers);
    if (validatedPlayers.length < 2) {
      alert("Veuillez ajouter au moins deux joueurs.");
      return;
    }

    navigation.navigate("Game", { mode: gameType, players: validatedPlayers });
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView style={styles.safeArea}>
          {/* Section défilable */}
          <ScrollView
            style={styles.scrollContainer}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            {/* Options de jeu */}
            <LineSeparator text="Options de jeu" />
            <View style={styles.section}>
              <TouchableOpacity
                style={[
                  styles.gameTypeButton,
                  gameType.name === "501" && styles.selectedButton,
                ]}
                onPress={() =>
                  setGameType({ ...gameType, name: "501", initialScore: 501 })
                }
              >
                <Text style={styles.buttonText}>501</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.gameTypeButton,
                  gameType.name === "301" && styles.selectedButton,
                ]}
                onPress={() =>
                  setGameType({ ...gameType, name: "301", initialScore: 301 })
                }
              >
                <Text style={styles.buttonText}>301</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.section}>
              <TouchableOpacity
                style={[
                  styles.gameTypeButton,
                  !gameType.requireDoubleToStart && styles.selectedButton,
                ]}
                onPress={() =>
                  setGameType({ ...gameType, requireDoubleToStart: false })
                }
              >
                <Text style={styles.buttonText}>Entrée simple</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.gameTypeButton,
                  gameType.requireDoubleToStart && styles.selectedButton,
                ]}
                onPress={() =>
                  setGameType({ ...gameType, requireDoubleToStart: true })
                }
              >
                <Text style={styles.buttonText}>Entrée double</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.section}>
              <TouchableOpacity
                style={[
                  styles.gameTypeButton,
                  !gameType.requireDoubleToEnd && styles.selectedButton,
                ]}
                onPress={() =>
                  setGameType({ ...gameType, requireDoubleToEnd: false })
                }
              >
                <Text style={styles.buttonText}>Sortie simple</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.gameTypeButton,
                  gameType.requireDoubleToEnd && styles.selectedButton,
                ]}
                onPress={() =>
                  setGameType({ ...gameType, requireDoubleToEnd: true })
                }
              >
                <Text style={styles.buttonText}>Sortie double</Text>
              </TouchableOpacity>
            </View>

            {/* Joueurs */}
            <LineSeparator text="Joueurs" />
            {players.map((player, index) => (
              <View style={styles.playerRow} key={player.id}>
                <TextInput
                  style={styles.input}
                  placeholder={`Joueur ${index + 1}`}
                  value={player.name}
                  onChangeText={(name) => handlePlayerNameChange(name, index)}
                />
                <TouchableOpacity onPress={() => deletePlayer(index)}>
                  <Ionicons
                    style={styles.deleteInput}
                    name="close"
                    size={40}
                    color="red"
                  />
                </TouchableOpacity>
              </View>
            ))}
            <AddNewPlayerButton onAddPlayer={addNewPlayer} />
          </ScrollView>

          {/* Bouton fixe en bas de l'écran */}
          <View style={styles.footer}>
            <BasicButton textValue="Lancer le jeu" onPress={startGame} />
          </View>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f7f7",
  },
  safeArea: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100, // Laisser de l'espace pour le bouton en bas
  },
  section: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  gameTypeButton: {
    width: "47%",
    backgroundColor: "#b5b7b3",
    padding: 12,
    borderRadius: 5,
    alignItems: "center",
  },
  selectedButton: {
    backgroundColor: "#6200ea",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  playerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  input: {
    flex: 1,
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  deleteInput: {
    marginLeft: 10,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#f7f7f7",
    padding: 20,
    borderTopWidth: 1,
    borderColor: "#ccc",
  },
});

export default SetupGameScreen;
