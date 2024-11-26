import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/HomeScreen";
import GameScreen from "../screens/GameScreen";
import SettingsScreen from "../screens/SettingsScreen";
import SetupGameScreen from "../screens/SetupGameScreen";
import { GameType, Player } from "../types/game";
import StatsScreen from "../screens/StatsScreen";

export type RootStackParamList = {
  Home: undefined;
  Game: { mode: GameType; players: Player[] };
  Settings: undefined;
  "Setup Game": { mode: string };
  Stats: { mode: GameType; players: Player[] };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen
          name="Game"
          component={GameScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="Setup Game" component={SetupGameScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="Stats" component={StatsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
