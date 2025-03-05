import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Alert } from 'react-native';
import Button from '../../components/Button';
import Card from '../../components/Card';
import { useAuth } from '../../hooks/useAuth';
import { User } from '../../types';

const ProfileScreen = () => {
  const { user, logout, loading } = useAuth();
  const userEmail = user ? (user as User)?.email : 'No email';
  const displayName = userEmail ? userEmail.split('@')[0] : 'User';

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      Alert.alert('Error', 'Failed to log out. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
        </View>

        <Card style={styles.profileCard}>
          <Text style={styles.name}>{displayName}</Text>
          <Text style={styles.email}>{userEmail}</Text>
        </Card>

        <Card style={styles.statsCard}>
          <Text style={styles.cardTitle}>Your Stats</Text>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>0</Text>
              <Text style={styles.statLabel}>Games</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>0</Text>
              <Text style={styles.statLabel}>Wins</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>0</Text>
              <Text style={styles.statLabel}>Points</Text>
            </View>
          </View>
        </Card>

        <View style={styles.buttonContainer}>
          <Button
            title="Log Out"
            onPress={handleLogout}
            loading={loading}
            mode="outline"
          />
        </View>
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
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6200ee',
  },
  profileCard: {
    alignItems: 'center',
    padding: 24,
    marginBottom: 16,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#424242',
  },
  email: {
    fontSize: 16,
    color: '#757575',
  },
  statsCard: {
    marginBottom: 24,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#424242',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6200ee',
  },
  statLabel: {
    fontSize: 14,
    color: '#757575',
    marginTop: 4,
  },
  buttonContainer: {
    marginTop: 16,
  },
});

export default ProfileScreen; 