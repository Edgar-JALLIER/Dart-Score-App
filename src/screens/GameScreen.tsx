import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import BasicButton from "../components/Button/BasicButton";

type Props = NativeStackScreenProps<RootStackParamList, "Game">;

const GameScreen: React.FC<Props> = ({ route }) => {
  const { mode, players } = route.params;
  // const [players, setPlayers] = useState<string[]>(["Joueur 1", "Joueur 2"]);
  const [scores, setScores] = useState<number[]>(Array(players.length).fill(0));

  const handleScoreUpdate = (index: number, value: string) => {
    const updatedScores = [...scores];
    updatedScores[index] = parseInt(value) || 0;
    setScores(updatedScores);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mode de jeu : {mode}</Text>
      {players.map((player, index) => (
        <View key={index + 1} style={styles.playerRow}>
          <Text style={styles.playerName}>{player}</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            placeholder="Entrez le score"
            onChangeText={(value) => handleScoreUpdate(index, value)}
          />
        </View>
      ))}
      <BasicButton
        textValue="Terminer le tour"
        onPress={() => console.log(scores)}
      />
      {/* <Button title="Terminer le tour" onPress={() => console.log(scores)} /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f8f9fa",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  playerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  playerName: {
    fontSize: 18,
    flex: 1,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    borderRadius: 5,
    width: "40%",
    textAlign: "center",
  },
});

export default GameScreen;
