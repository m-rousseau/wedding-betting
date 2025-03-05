import React from 'react';
import { View, Text, StyleSheet, Image, SafeAreaView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/types';
import Button from '../../components/Button';

type WelcomeScreenProps = NativeStackScreenProps<AuthStackParamList, 'Welcome'>;

const WelcomeScreen = ({ navigation }: WelcomeScreenProps) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Wedding Betting</Text>
          <Text style={styles.subtitle}>
            Join the fun and bet on wedding outcomes!
          </Text>
        </View>

        <View style={styles.imageContainer}>
          <Image
            source={require('../../../assets/wedding-icon.png')}
            style={styles.image}
            resizeMode="contain"
          />
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title="Sign Up"
            onPress={() => navigation.navigate('SignUp')}
            mode="primary"
            style={styles.button}
          />
          <Button
            title="Log In"
            onPress={() => navigation.navigate('Login')}
            mode="outline"
            style={styles.button}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    marginTop: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#6200ee',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#757575',
    textAlign: 'center',
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 200,
    height: 200,
  },
  buttonContainer: {
    marginBottom: 24,
  },
  button: {
    marginVertical: 8,
  },
});

export default WelcomeScreen; 