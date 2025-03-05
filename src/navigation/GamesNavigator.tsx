import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GamesStackParamList } from './types';

// Import screens
import GamesListScreen from '../screens/games/GamesListScreen';
import GameDetailsScreen from '../screens/games/GameDetailsScreen';
import GameResultsScreen from '../screens/games/GameResultsScreen';
import CreateGameScreen from '../screens/games/CreateGameScreen';
import AnswerQuestionScreen from '../screens/games/AnswerQuestionScreen';
import VoteOnAnswersScreen from '../screens/games/VoteOnAnswersScreen';
import PollScreen from '../screens/games/PollScreen';
import CreatePollScreen from '../screens/games/CreatePollScreen';

const Stack = createNativeStackNavigator<GamesStackParamList>();

export const GamesNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="GamesList"
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: '#6200ee',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name="GamesList" 
        component={GamesListScreen} 
        options={{ title: 'Games' }}
      />
      <Stack.Screen 
        name="GameDetails" 
        component={GameDetailsScreen} 
        options={{ title: 'Game Details' }}
      />
      <Stack.Screen 
        name="GameResults" 
        component={GameResultsScreen} 
        options={{ title: 'Results' }}
      />
      <Stack.Screen 
        name="CreateGame" 
        component={CreateGameScreen} 
        options={{ title: 'Create Game' }}
      />
      <Stack.Screen 
        name="AnswerQuestion" 
        component={AnswerQuestionScreen} 
        options={{ title: 'Answer Question' }}
      />
      <Stack.Screen 
        name="VoteOnAnswers" 
        component={VoteOnAnswersScreen} 
        options={{ title: 'Vote on Answers' }}
      />
      <Stack.Screen 
        name="Poll" 
        component={PollScreen} 
        options={{ title: 'Poll' }}
      />
      <Stack.Screen 
        name="CreatePoll" 
        component={CreatePollScreen} 
        options={{ title: 'Create Poll' }}
      />
    </Stack.Navigator>
  );
}; 