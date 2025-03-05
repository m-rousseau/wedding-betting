import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  FlatList, 
  KeyboardAvoidingView, 
  Platform,
  TouchableOpacity,
  Image
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ChatStackParamList } from '../../navigation/types';
import Input from '../../components/Input';
import Button from '../../components/Button';
import ErrorMessage from '../../components/ErrorMessage';
import { useChat } from '../../hooks/useChat';
import { useAuth } from '../../hooks/useAuth';
import { formatDateTime } from '../../utils/dateUtils';

type ChatRoomScreenProps = NativeStackScreenProps<ChatStackParamList, 'ChatRoom'>;

const ChatRoomScreen = ({ route }: ChatRoomScreenProps) => {
  const { chatId, chatName } = route.params;
  const { messages, loading, error, sendMessage, loadMessages } = useChat(chatId);
  const { user } = useAuth();
  const [messageText, setMessageText] = useState('');
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    loadMessages(chatId);
  }, [chatId, loadMessages]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (messages.length > 0 && flatListRef.current) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!messageText.trim()) return;
    
    try {
      await sendMessage(chatId, messageText);
      setMessageText('');
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  const renderMessage = ({ item }: { item: any }) => {
    const isCurrentUser = item.user_id === user?.id;
    
    return (
      <View style={[
        styles.messageContainer,
        isCurrentUser ? styles.currentUserMessage : styles.otherUserMessage
      ]}>
        {item.photo_url && (
          <Image 
            source={{ uri: item.photo_url }} 
            style={styles.messageImage} 
            resizeMode="cover"
          />
        )}
        <Text style={styles.messageText}>{item.content}</Text>
        <Text style={styles.messageTime}>{formatDateTime(item.timestamp)}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <ErrorMessage message={error} />
        
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messagesList}
          onRefresh={() => loadMessages(chatId)}
          refreshing={loading}
        />
        
        <View style={styles.inputContainer}>
          <Input
            value={messageText}
            onChangeText={setMessageText}
            placeholder="Type a message..."
            multiline
            style={styles.input}
            label=""
          />
          <TouchableOpacity 
            style={styles.sendButton}
            onPress={handleSendMessage}
            disabled={!messageText.trim()}
          >
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  messagesList: {
    padding: 16,
  },
  messageContainer: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
    marginBottom: 12,
  },
  currentUserMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#e3f2fd',
    borderBottomRightRadius: 4,
  },
  otherUserMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#fff',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    color: '#424242',
  },
  messageImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 8,
  },
  messageTime: {
    fontSize: 12,
    color: '#757575',
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 8,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  input: {
    flex: 1,
    marginBottom: 0,
  },
  sendButton: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#6200ee',
    borderRadius: 24,
    width: 60,
    height: 40,
    marginLeft: 8,
    alignSelf: 'flex-end',
    marginBottom: 8,
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default ChatRoomScreen; 