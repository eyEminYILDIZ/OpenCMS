import { NavigationContainer } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import BottomTabNavigator from './src/navigation/BottomTabNavigator';
import { stores } from './src/stores';

export default function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const { applicationStore, agentStore, assetStore, operationStore } = stores;

  useEffect(() => {
    applicationStore.initialize();
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <NavigationContainer>
        <BottomTabNavigator />
      </NavigationContainer>
      <Toast />
    </SafeAreaProvider>
  );
}
