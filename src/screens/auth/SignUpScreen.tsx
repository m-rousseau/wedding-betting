import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/types';
import Input from '../../components/Input';
import Button from '../../components/Button';
import ErrorMessage from '../../components/ErrorMessage';
import { useAuth } from '../../hooks/useAuth';

type SignUpScreenProps = NativeStackScreenProps<AuthStackParamList, 'SignUp'>;

const SignUpScreen = ({ navigation }: SignUpScreenProps) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [validationError, setValidationError] = useState('');
  const { signUp, loading, error } = useAuth();

  const handleSignUp = async () => {
    // Reset validation error
    setValidationError('');
    
    // Validate inputs
    if (!name || !email || !password || !confirmPassword) {
      setValidationError('All fields are required');
      return;
    }
    
    if (password !== confirmPassword) {
      setValidationError('Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      setValidationError('Password must be at least 6 characters');
      return;
    }
    
    // Attempt sign up
    await signUp(email, password, name);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Sign up to get started</Text>
        </View>

        <View style={styles.form}>
          <ErrorMessage message={validationError || error} />
          
          <Input
            label="Name"
            value={name}
            onChangeText={setName}
            placeholder="Enter your name"
            autoCapitalize="words"
          />
          
          <Input
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
            autoCapitalize="none"
            keyboardType="email-address"
          />
          
          <Input
            label="Password"
            value={password}
            onChangeText={setPassword}
            placeholder="Create a password"
            secureTextEntry
          />
          
          <Input
            label="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Confirm your password"
            secureTextEntry
          />
          
          <Button
            title="Sign Up"
            onPress={handleSignUp}
            loading={loading}
            disabled={!name || !email || !password || !confirmPassword || loading}
            mode="primary"
            style={styles.button}
          />
          
          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <Text 
              style={styles.footerLink}
              onPress={() => navigation.navigate('Login')}
            >
              Log In
            </Text>
          </View>
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
    flexGrow: 1,
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginVertical: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#6200ee',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#757575',
  },
  form: {
    flex: 1,
  },
  button: {
    marginTop: 24,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  footerText: {
    color: '#757575',
  },
  footerLink: {
    color: '#6200ee',
    fontWeight: 'bold',
  },
});

export default SignUpScreen; 