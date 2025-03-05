import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ChatStackParamList } from './types';

// Screens
import ChatListScreen from '../screens/chat/ChatListScreen';
import ChatRoomScreen from '../screens/chat/ChatRoomScreen';

const Stack = createNativeStackNavigator<ChatStackParamList>();

const ChatNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="ChatList"
      screenOptions={{
        headerShown: true,
        headerBackTitleVisible: false,
        headerTintColor: '#6200ee',
      }}
    >
      <Stack.Screen 
        name="ChatList" 
        component={ChatListScreen} 
        options={{ title: 'Chats' }}
      />
      <Stack.Screen 
        name="ChatRoom" 
        component={ChatRoomScreen} 
        options={({ route }) => ({ title: route.params.chatName })}
      />
    </Stack.Navigator>
  );
};

export default ChatNavigator; 