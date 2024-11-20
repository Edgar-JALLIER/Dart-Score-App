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
} from "react-native";
import { StackScreenProps } from "@react-navigation/stack"; // Importez le bon type
import AddNewPlayerButton from "../components/Button/AddNewPlayerButton";
import uuid from "react-native-uuid";
import { Ionicons } from "@expo/vector-icons";
import { RootStackParamList } from "../navigation/AppNavigator";
import BasicButton from "../components/Button/BasicButton";
import { GameType, Player } from "../types/game";

type Props = StackScreenProps<RootStackParamList, "Setup Game">;

const SetupGameScreen: React.FC<Props> = ({ route, navigation }) => {
  const { mode } = route.params;
  const [gameType, setGameType] = useState<GameType>("501");
  const [numPlayers, setNumPlayers] = useState<number>(2);
  const [players, setPlayers] = useState<Player[]>(
    new Array(2).fill(null).map((_, index) => ({
      id: uuid.v4(),
      name: "",
      score: parseInt(gameType),
      throws: [],
      average: 0,
    }))
  );

  // Mettre à jour les scores des joueurs chaque fois que le gameType change
  useEffect(() => {
    const updatedPlayers = players.map((player) => ({
      ...player,
      score: parseInt(gameType),
    }));
    setPlayers(updatedPlayers);
  }, [gameType]);

  // Ajout d'un nouveau joueur
  const addNewPlayer = () => {
    const newPlayer: Player = {
      id: uuid.v4(),
      name: "",
      score: parseInt(gameType),
      throws: [],
      average: 0,
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

    navigation.navigate("Game", { players: updatedPlayers, mode });
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      // behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <SafeAreaView style={{ flex: 1 }}>
          <Text style={styles.title}>Mode de jeu</Text>

          {/* Section pour les boutons de type de jeu */}
          <View style={styles.section}>
            <TouchableOpacity
              style={[
                styles.gameTypeButton,
                gameType === "501" && styles.selectedButton,
              ]}
              onPress={() => setGameType("501")}
            >
              <Text style={styles.buttonText}>501</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.gameTypeButton,
                gameType === "301" && styles.selectedButton,
              ]}
              onPress={() => setGameType("301")}
            >
              <Text style={styles.buttonText}>301</Text>
            </TouchableOpacity>
          </View>

          {/* Liste des joueurs avec défilement possible */}
          <ScrollView
            contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
            keyboardShouldPersistTaps="handled" // Permet au clavier de rester ouvert si un élément est cliqué
          >
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

          {/* Bouton pour démarrer le jeu */}
          <BasicButton textValue="Lancer le jeu" onPress={startGame} />
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f7f7f7",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    flex: 1,
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 15,
    fontSize: 18,
    backgroundColor: "#fff",
  },
  section: {
    flex: 0,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
    columnGap: 20,
  },
  gameTypeButton: {
    backgroundColor: "#b5b7b3",
    width: "47%",
    padding: 12,
    borderRadius: 5,
    marginBottom: 10,
    alignItems: "center",
  },
  selectedButton: {
    backgroundColor: "#6200ea",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  deleteInput: {
    paddingLeft: 10,
  },
  playerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15, // Plus d’espace entre les lignes
  },
  deleteButton: {
    marginLeft: 10,
    backgroundColor: "red",
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  deleteIcon: {
    color: "#fff", // Couleur blanche pour l'icône
    fontSize: 28, // Icône plus grande
  },
});

export default SetupGameScreen;
