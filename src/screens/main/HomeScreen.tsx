import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import Card from '../../components/Card';
import { useAuth } from '../../hooks/useAuth';
import { User } from '../../types';

const HomeScreen = () => {
  const { user } = useAuth();
  const userName = user ? (user as User)?.user_metadata?.name || 'Guest' : 'Guest';

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.greeting}>Hello, {userName}</Text>
          <Text style={styles.subtitle}>Welcome to Wedding Betting</Text>
        </View>

        <Card style={styles.card}>
          <Text style={styles.cardTitle}>Active Games</Text>
          <Text style={styles.cardContent}>
            You have no active games. Join a game or create your own!
          </Text>
        </Card>

        <Card style={styles.card}>
          <Text style={styles.cardTitle}>Recent Activity</Text>
          <Text style={styles.cardContent}>
            No recent activity to display.
          </Text>
        </Card>

        <Card style={styles.card}>
          <Text style={styles.cardTitle}>Upcoming Events</Text>
          <Text style={styles.cardContent}>
            No upcoming events to display.
          </Text>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6200ee',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#757575',
  },
  card: {
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#424242',
  },
  cardContent: {
    fontSize: 14,
    color: '#757575',
  },
});

export default HomeScreen; 