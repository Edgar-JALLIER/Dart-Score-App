import React from "react";
import { SafeAreaView, StatusBar, StyleSheet } from "react-native";
import AppNavigator from "./src/navigation/AppNavigator";

const App: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      {/* Ajout de la barre d'état personnalisée */}
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
      {/* Navigation principale */}
      <AppNavigator />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa", // Couleur de fond par défaut
  },
});

export default App;
