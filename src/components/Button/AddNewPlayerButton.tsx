import React from "react";
import { StyleSheet, TouchableOpacity, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Icones modernes

type AddPlayerButtonProps = {
  onAddPlayer: () => void; // Fonction pour ajouter un joueur
};

const AddNewPlayerButton: React.FC<AddPlayerButtonProps> = ({
  onAddPlayer,
}) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onAddPlayer}>
      <Ionicons name="person-add" size={24} color="#fff" />
      <Text style={styles.text}>Ajouter un joueur</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#6200ea", // Couleur violet
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    alignSelf: "center",
    marginTop: 10,
  },
  text: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 12,
  },
});
export default AddNewPlayerButton;
