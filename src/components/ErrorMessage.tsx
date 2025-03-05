import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type ErrorMessageProps = {
  message: string | null;
};

const ErrorMessage = ({ message }: ErrorMessageProps) => {
  if (!message) return null;
  
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffebee',
    padding: 12,
    borderRadius: 4,
    marginBottom: 16,
  },
  text: {
    color: '#d32f2f',
    fontSize: 14,
  },
});

export default ErrorMessage; 