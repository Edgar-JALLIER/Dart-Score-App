import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { StackScreenProps } from "@react-navigation/stack"; // Importez le bon type
import AddNewPlayerButton from "../components/Button/AddNewPlayerButton";
import { Ionicons } from "@expo/vector-icons";
import { RootStackParamList } from "../navigation/AppNavigator";
import BasicButton from "../components/Button/BasicButton";

type Props = StackScreenProps<RootStackParamList, "Setup Game">;

const SetupGameScreen: React.FC<Props> = ({ route, navigation }) => {
  const { mode } = route.params;

  const [numPlayers, setNumPlayers] = useState<number>(2);
  const [players, setPlayers] = useState<string[]>(
    new Array(numPlayers).fill("")
  );

  const addNewPlayer = () => {
    setNumPlayers(numPlayers + 1);
    setPlayers([...players, ""]); // Ajoute un joueur vide à la liste des joueurs
  };

  const handlePlayerNameChange = (name: string, index: number) => {
    const updatedPlayers = [...players];
    updatedPlayers[index] = name;
    setPlayers(updatedPlayers);
  };

  const deletePlayer = (index: number) => {
    const updatedPlayers = players.filter((_, i) => i !== index);
    setPlayers(updatedPlayers);
  };

  const startGame = () => {
    const updatedPlayers = players.map(
      (player, index) => (player.trim() === "" ? `Joueur ${index + 1}` : player) // Ajoute un nom par défaut si vide
    );
    if (updatedPlayers.length < 2) {
      alert("Veuillez ajouter au moins deux joueurs");
    } else {
      navigation.navigate("Game", { players: updatedPlayers, mode });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Mode de jeu : {mode}</Text>

      {/* Liste des joueurs */}
      <FlatList
        data={players}
        renderItem={({ item, index }) => (
          <View style={styles.playerRow}>
            <TextInput
              style={styles.input}
              placeholder={`Joueur ${index + 1}`}
              value={item}
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
        )}
        keyExtractor={(item, index) => index.toString()}
        // Ajoute le bouton "Ajouter un joueur" à la fin de la liste
        ListFooterComponent={
          <AddNewPlayerButton onAddPlayer={addNewPlayer} /> // Bouton après les inputs
        }
      />

      {/* Bouton pour démarrer le jeu */}
      <BasicButton textValue="Lancer le jeu" onPress={startGame} />
    </SafeAreaView>
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
