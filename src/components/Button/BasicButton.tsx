import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

type BasicButtonProps = {
  textValue: string;
  onPress: () => void;
};

const BasicButton: React.FC<BasicButtonProps> = ({ textValue, onPress }) => {
  return (
    <View style={styles.buttonContainer}>
      <TouchableOpacity style={styles.customButton} onPress={onPress}>
        <Text style={styles.buttonText}>{textValue}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    alignItems: "center",
    width: "100%",
  },
  customButton: {
    backgroundColor: "#6200ea", // Couleur de fond
    paddingVertical: 15, // Espace interne vertical
    paddingHorizontal: 30, // Espace interne horizontal
    borderRadius: 8, // Bords arrondis
    width: "100%", // Largeur de 80%
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000", // Optionnel : effet d'ombre
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3, // Pour Android
  },
  buttonText: {
    color: "#fff", // Texte blanc
    fontSize: 18, // Taille du texte
    fontWeight: "bold", // Texte en gras
  },
});

export default BasicButton;
