import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GameStackParamList } from './types';

// Screens
import GameListScreen from '../screens/games/GameListScreen';
import GameDetailsScreen from '../screens/games/GameDetailsScreen';
import CreateGameScreen from '../screens/games/CreateGameScreen';
import EditGameScreen from '../screens/games/EditGameScreen';

const Stack = createNativeStackNavigator<GameStackParamList>();

const GameNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="GameList"
      screenOptions={{
        headerShown: true,
        headerBackTitleVisible: false,
        headerTintColor: '#6200ee',
      }}
    >
      <Stack.Screen 
        name="GameList" 
        component={GameListScreen} 
        options={{ title: 'Games' }}
      />
      <Stack.Screen 
        name="GameDetails" 
        component={GameDetailsScreen} 
        options={{ title: 'Game Details' }}
      />
      <Stack.Screen 
        name="CreateGame" 
        component={CreateGameScreen} 
        options={{ title: 'Create Game' }}
      />
      <Stack.Screen 
        name="EditGame" 
        component={EditGameScreen} 
        options={{ title: 'Edit Game' }}
      />
    </Stack.Navigator>
  );
};

export default GameNavigator; 