import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
} from "react-native";

type ScoreInputProps = {
  readonly onScoreSubmit: (score: number) => void;
};

export function ScoreInput({ onScoreSubmit }: ScoreInputProps) {
  const [score, setScore] = useState<string>("");

  const handleSubmit = () => {
    const numScore = parseInt(score, 10);
    if (!isNaN(numScore) && numScore >= 0 && numScore <= 180) {
      onScoreSubmit(numScore);
      setScore("");
    } else {
      alert("Le score doit être compris entre 0 et 180");
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        placeholder="Entrez le score (0-180)"
        value={score}
        onChangeText={setScore}
      />
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Valider le score</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    padding: 16,
    backgroundColor: "#333",
    borderRadius: 8,
  },
  input: {
    backgroundColor: "white",
    padding: 12,
    borderRadius: 4,
    marginBottom: 12,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#4CAF50",
    padding: 12,
    borderRadius: 4,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
