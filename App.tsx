import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Navigation } from './src/navigation';
import 'react-native-url-polyfill/auto';

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="auto" />
      <Navigation />
    </SafeAreaProvider>
  );
}
