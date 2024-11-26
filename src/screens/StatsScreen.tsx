import React from "react";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { StyleSheet, Text, View } from "react-native";

type Props = StackScreenProps<RootStackParamList, "Stats">;

const StatsScreen: React.FC<Props> = ({ navigation, route }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Statistiques</Text>
      <Text style={styles.statItem}>En cours de développement</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a1a",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginBottom: 20,
  },
  statItem: {
    fontSize: 18,
    color: "white",
    marginBottom: 12,
  },
});

export default StatsScreen;
