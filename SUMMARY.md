# Wedding Betting App - Project Summary

## Overview
The Wedding Betting App is a mobile application built with React Native and Expo that allows wedding guests to participate in fun betting games based on wedding-related outcomes and interact via real-time chat rooms.

## Project Structure

### Components
- **Button**: Customizable button component with different modes (primary, secondary, outline) and loading state
- **Card**: Container component for displaying content in a card-like UI
- **CountdownTimer**: Timer component that counts down to a specified end time
- **ErrorMessage**: Component for displaying error messages
- **Input**: Text input component with label, error handling, and various input types
- **LoadingScreen**: Loading indicator screen

### Screens
- **Auth Screens**:
  - WelcomeScreen: Initial screen with app introduction and auth options
  - LoginScreen: User login screen
  - SignUpScreen: User registration screen
- **Main Screens**:
  - HomeScreen: Dashboard with overview of active games and recent activity
  - ProfileScreen: User profile with stats and logout option
- **Game Screens**:
  - GameListScreen: List of available games
  - GameDetailsScreen: Detailed view of a specific game
  - CreateGameScreen: Form for creating a new game
  - EditGameScreen: Form for editing an existing game
- **Chat Screens**:
  - ChatListScreen: List of available chat rooms
  - ChatRoomScreen: Real-time chat interface

### Navigation
- **AuthNavigator**: Stack navigator for authentication screens
- **MainTabNavigator**: Tab navigator for main app screens
- **GameNavigator**: Stack navigator for game-related screens
- **ChatNavigator**: Stack navigator for chat-related screens

### Hooks
- **useAuth**: Authentication state and methods
- **useGame**: Game data management and interactions
- **useChat**: Chat room management and messaging
- **usePoll**: Poll creation and voting

### Services
- **authService**: Authentication API calls
- **gameService**: Game-related API calls
- **chatService**: Chat-related API calls
- **pollService**: Poll-related API calls

### Utils
- **dateUtils**: Date formatting and manipulation
- **errorHandler**: Error handling and formatting
- **imageCompression**: Image compression for uploads

## Key Features
1. **Authentication**: Email/password authentication with Supabase
2. **Game Management**: Create questions, set timers, and manage voting
3. **Real-time Chat**: Group and private messaging
4. **Polls**: Create polls and collect votes from participants
5. **Countdown Timers**: Track time until answer submission deadlines

## Technology Stack
- **Frontend**: React Native with Expo
- **Backend**: Supabase (Authentication, Database, Storage, Real-time)
- **State Management**: React Hooks
- **Navigation**: React Navigation
- **UI Components**: Custom components with consistent styling

## Next Steps
1. Implement remaining API services
2. Add unit and integration tests
3. Set up CI/CD pipeline
4. Implement push notifications
5. Add analytics tracking 