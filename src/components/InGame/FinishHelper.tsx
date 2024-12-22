import React, { useEffect, useRef } from "react";
import { Text, View, StyleSheet, Animated } from "react-native";
import { Suggestion } from "../../types/game";

type SuggestionProps = {
  suggestion: Suggestion[] | null;
};

const FinishHelper: React.FC<SuggestionProps> = ({ suggestion }) => {
  // Référence pour l'animation de mise à l'échelle
  const scaleValue = useRef(new Animated.Value(1)).current; // Valeur initiale à 1 (taille normale)

  // Fonction pour démarrer l'animation de mise à l'échelle
  const startScaleAnimation = () => {
    // Crée une boucle infinie d'agrandissement et de réduction de la taille
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleValue, {
          toValue: 1, // Taille 120%
          duration: 0, // Durée de l'agrandissement
          useNativeDriver: true, // Utiliser le moteur natif pour la performance
        }),
        Animated.timing(scaleValue, {
          toValue: 1.15, // Retour à la taille normale 100%
          duration: 500, // Durée de la réduction
          useNativeDriver: true,
        }),
        Animated.timing(scaleValue, {
          toValue: 1, // Retour à la taille normale 100%
          duration: 500, // Durée de la réduction
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  // Lancer l'animation dès que les suggestions sont présentes
  useEffect(() => {
    if (suggestion) {
      startScaleAnimation();
    }
  }, [suggestion]); // Se déclenche dès que la suggestion change

  return (
    <View style={styles.container}>
      <Text style={styles.suggestionTexte}>Suggestions :</Text>
      {suggestion?.map((s, index) => (
        <Animated.View
          key={index + 1}
          style={[
            styles.containerScore,
            {
              transform: [{ scale: scaleValue }], // Appliquer l'échelle animée
            },
          ]}
        >
          <Text style={styles.textScore}>
            {s.type !== "S" && s.type}
            {s.value}
          </Text>
        </Animated.View>
      ))}
    </View>
  );
};

export default FinishHelper;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#222",
    padding: 10,
    paddingBottom: 0,
  },
  suggestionTexte: {
    color: "white",
    fontSize: 18,
    marginHorizontal: 10,
  },
  containerScore: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#444",
    padding: 5,
    borderRadius: 5,
    marginHorizontal: 10,
    minWidth: 35,
    zIndex: 10,
  },
  textScore: {
    color: "white",
    fontWeight: "bold",
  },
});
