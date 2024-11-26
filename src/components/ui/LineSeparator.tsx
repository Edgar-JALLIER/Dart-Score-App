import React from "react";
import { View, Text, StyleSheet } from "react-native";

type LineSeparatorProps = {
  text: string;
};

const LineSeparator: React.FC<LineSeparatorProps> = ({ text }) => {
  return (
    <View style={styles.container}>
      <View style={styles.line} />
      <View>
        <Text style={styles.text}>{text}</Text>
      </View>
      <View style={styles.line} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  line: {
    flex: 1,
    height: 2,
    backgroundColor: "black",
  },
  text: {
    marginHorizontal: 15,
    textAlign: "center",
    fontSize: 18,
  },
});

export default LineSeparator;
