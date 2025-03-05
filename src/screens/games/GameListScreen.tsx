import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { GameStackParamList } from '../../navigation/types';
import Button from '../../components/Button';
import Card from '../../components/Card';

type GameListScreenProps = NativeStackScreenProps<GameStackParamList, 'GameList'>;

const GameListScreen = ({ navigation }: GameListScreenProps) => {
  // Placeholder data
  const games = [
    { id: '1', title: 'Smith Wedding', date: 'June 15, 2023', participants: 12 },
    { id: '2', title: 'Johnson Wedding', date: 'July 22, 2023', participants: 8 },
    { id: '3', title: 'Williams Wedding', date: 'August 5, 2023', participants: 15 },
  ];

  const renderItem = ({ item }: { item: typeof games[0] }) => (
    <TouchableOpacity onPress={() => navigation.navigate('GameDetails', { gameId: item.id })}>
      <Card style={styles.gameCard}>
        <Text style={styles.gameTitle}>{item.title}</Text>
        <Text style={styles.gameDate}>{item.date}</Text>
        <Text style={styles.gameParticipants}>{item.participants} participants</Text>
      </Card>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Wedding Betting Games</Text>
      </View>

      {games.length > 0 ? (
        <FlatList
          data={games}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No games available</Text>
        </View>
      )}

      <View style={styles.buttonContainer}>
        <Button
          title="Create New Game"
          onPress={() => navigation.navigate('CreateGame')}
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
  gameCard: {
    marginBottom: 12,
  },
  gameTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#424242',
    marginBottom: 4,
  },
  gameDate: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 4,
  },
  gameParticipants: {
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

export default GameListScreen; 