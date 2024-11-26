import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { RootStackParamList } from "../navigation/AppNavigator";
import BasicButton from "../components/Button/BasicButton";

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenue aux Fléchettes 🎯</Text>
      <BasicButton
        textValue="Jeu Classique"
        onPress={() => navigation.navigate("Setup Game", { mode: "Classique" })}
      />
      <BasicButton
        textValue="301 - 501"
        onPress={() => navigation.navigate("Setup Game", { mode: "301 - 501" })}
      />
      <BasicButton
        textValue="Paramètres"
        onPress={() => navigation.navigate("Settings")}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    rowGap: 30,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
});

export default HomeScreen;
