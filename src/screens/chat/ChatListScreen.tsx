import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ChatStackParamList } from '../../navigation/types';
import Button from '../../components/Button';
import Card from '../../components/Card';
import ErrorMessage from '../../components/ErrorMessage';
import { useChat } from '../../hooks/useChat';

type ChatListScreenProps = NativeStackScreenProps<ChatStackParamList, 'ChatList'>;

const ChatListScreen = ({ navigation }: ChatListScreenProps) => {
  const { chatRooms, loading, error, loadChatRooms, createChatRoom } = useChat();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newChatName, setNewChatName] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);

  useEffect(() => {
    loadChatRooms();
  }, [loadChatRooms]);

  const handleCreateChat = async () => {
    if (!newChatName.trim()) {
      Alert.alert('Error', 'Please enter a chat room name');
      return;
    }

    try {
      // Call createChatRoom function (to be implemented in useChat hook)
      // await createChatRoom(newChatName, isPrivate);
      Alert.alert('Success', 'Chat room created successfully!');
      setNewChatName('');
      setIsPrivate(false);
      setShowCreateForm(false);
      loadChatRooms();
    } catch (err) {
      console.error('Failed to create chat room:', err);
    }
  };

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity 
      onPress={() => navigation.navigate('ChatRoom', { 
        chatId: item.id, 
        chatName: item.name 
      })}
    >
      <Card style={styles.chatCard}>
        <Text style={styles.chatName}>{item.name}</Text>
        <View style={styles.chatInfo}>
          <Text style={styles.chatType}>
            {item.is_private ? 'Private' : 'Public'}
          </Text>
          <Text style={styles.participantsCount}>
            {item.participants?.length || 0} participants
          </Text>
        </View>
      </Card>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Chat Rooms</Text>
      </View>

      <ErrorMessage message={error} />

      {chatRooms.length > 0 ? (
        <FlatList
          data={chatRooms}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          refreshing={loading}
          onRefresh={loadChatRooms}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No chat rooms available</Text>
        </View>
      )}

      <View style={styles.buttonContainer}>
        <Button
          title="Create New Chat Room"
          onPress={() => setShowCreateForm(true)}
          mode="primary"
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#424242',
  },
  listContent: {
    padding: 16,
  },
  chatCard: {
    marginBottom: 12,
  },
  chatName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#424242',
    marginBottom: 4,
  },
  chatInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  chatType: {
    fontSize: 14,
    color: '#757575',
  },
  participantsCount: {
    fontSize: 14,
    color: '#6200ee',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#757575',
  },
  buttonContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
});

export default ChatListScreen; 