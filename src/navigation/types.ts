import { NavigatorScreenParams } from '@react-navigation/native';

// Auth Stack
export type AuthStackParamList = {
  Welcome: undefined;
  Login: undefined;
  SignUp: undefined;
};

// Game Stack
export type GameStackParamList = {
  GameList: undefined;
  GameDetails: { gameId: string };
  CreateGame: undefined;
  EditGame: { gameId: string };
};

// Chat Stack
export type ChatStackParamList = {
  ChatList: undefined;
  ChatRoom: { chatId: string; chatName: string };
};

// Main Tab Navigator
export type MainTabParamList = {
  Home: undefined;
  Games: NavigatorScreenParams<GameStackParamList>;
  Chat: NavigatorScreenParams<ChatStackParamList>;
  Profile: undefined;
};

// Root Navigator
export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<MainTabParamList>;
}; 