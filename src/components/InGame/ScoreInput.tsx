import React, { useState } from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";

type ScoreInputProps = {
  readonly onScoreSubmit: (
    points: number,
    isDoubleValue: boolean,
    isTripleValue: boolean
  ) => void;
};
const ScoreInput: React.FC<ScoreInputProps> = ({ onScoreSubmit }) => {
  const [isDouble, setIsDouble] = useState<boolean>(false);
  const [isTriple, setIsTriple] = useState<boolean>(false);

  const numbers = [...Array(20).keys()]
    .map((n) => n + 1)
    .concat(25, 0)
    .filter((num) => !(isTriple && num === 25)); // exclure 25 si Triple est activé
  const columnsPerRow = 6; // Nombre de colonnes par ligne

  // Diviser les nombres en lignes
  const rows = numbers.reduce<number[][]>((acc, num, index) => {
    if (index % columnsPerRow === 0) {
      acc.push([]);
    }
    acc[acc.length - 1].push(num);
    return acc;
  }, []);

  const handlePress = (value: number) => {
    let finalScore = value;
    if (isDouble) finalScore *= 2;
    if (isTriple) finalScore *= 3;

    onScoreSubmit(finalScore, isDouble, isTriple);

    // Réinitialiser les multiplicateurs après soumission
    setIsDouble(false);
    setIsTriple(false);
  };

  const toggleDouble = () => {
    setIsDouble(!isDouble);
    setIsTriple(false); // Désactiver Triple si Double est activé
  };

  const toggleTriple = () => {
    setIsTriple(!isTriple);
    setIsDouble(false); // Désactiver Double si Triple est activé
  };

  return (
    <View style={styles.customKeyboard}>
      {/* Boutons générés dynamiquement */}
      {rows.map((row, rowIndex) => (
        <View key={`row-${rowIndex + 1} `} style={styles.row}>
          {row.map((number) => (
            <TouchableOpacity
              key={`key-${number}`}
              style={styles.keyButton}
              onPress={() => handlePress(number)}
            >
              <Text style={styles.keyText}>{number}</Text>
            </TouchableOpacity>
          ))}
        </View>
      ))}

      {/* Ligne pour les boutons spéciaux */}
      <View style={styles.row}>
        {[
          { label: "Double", action: toggleDouble, active: isDouble },
          { label: "Triple", action: toggleTriple, active: isTriple },
          {
            label: "Annuler",
            action: () => {
              onScoreSubmit(-1, false, false);
              setIsDouble(false);
              setIsTriple(false);
            },
          },
        ].map((button) => (
          <TouchableOpacity
            key={`special-${button.label}`}
            style={[
              styles.keyButton,
              styles.specialButton,
              button.active && styles.activeButton, // Appliquer un style actif si nécessaire
            ]}
            onPress={button.action}
          >
            <Text style={[styles.keyText, button.active && styles.activeText]}>
              {button.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};
// Styles
const styles = StyleSheet.create({
  customKeyboard: {
    padding: 10,
    backgroundColor: "#222",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 4,
    columnGap: 5,
  },
  keyButton: {
    backgroundColor: "#444",
    paddingVertical: 13,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 50,
    flex: 1,
  },
  keyText: {
    fontSize: 15,
    color: "#fff",
  },
  buttonText: {
    fontSize: 16,
    color: "#fff",
  },
  specialButton: {
    backgroundColor: "#555",
  },
  activeButton: {
    backgroundColor: "#ffcc00",
  },
  activeText: {
    color: "#000",
  },
});

export default ScoreInput;
