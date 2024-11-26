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
  const [players, setPlayers] = useState<Player[]>(
    new Array(2).fill(null).map((_, index) => ({
      id: uuid.v4(),
      name: "",
      score: gameType.initialScore,
      throws: [],
      average: 0,
      hasStarted: !gameType.requireDoubleToStart,
    }))
  );

  // Mettre à jour les scores des joueurs chaque fois que le gameType change
  useEffect(() => {
    const updatedPlayers = players.map((player) => ({
      ...player,
      score: gameType.initialScore,
      hasStarted: !gameType.requireDoubleToStart,
    }));
    setPlayers(updatedPlayers);
  }, [gameType]);

  // Ajout d'un nouveau joueur
  const addNewPlayer = () => {
    const newPlayer: Player = {
      id: uuid.v4(),
      name: "",
      score: gameType.initialScore,
      throws: [],
      average: 0,
      hasStarted: !gameType.requireDoubleToStart,
    };
    setPlayers([...players, newPlayer]);
    setNumPlayers(numPlayers + 1);
  };

  // Modification du nom d'un joueur
  const handlePlayerNameChange = (name: string, index: number) => {
    const updatedPlayers = [...players];
    updatedPlayers[index].name = name;
    setPlayers(updatedPlayers);
  };

  // Suppression d’un joueur
  const deletePlayer = (index: number) => {
    const updatedPlayers = players.filter((_, i) => i !== index);
    setPlayers(updatedPlayers);
    setNumPlayers(updatedPlayers.length);
  };

  // Validation et démarrage du jeu
  const startGame = () => {
    const updatedPlayers = players.map((player, index) => ({
      ...player,
      name: player.name.trim() === "" ? `Joueur ${index + 1}` : player.name,
    }));

    if (updatedPlayers.length < 2) {
      alert("Veuillez ajouter au moins deux joueurs.");
      return;
    }

    navigation.navigate("Game", { mode: gameType, players: updatedPlayers });
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
