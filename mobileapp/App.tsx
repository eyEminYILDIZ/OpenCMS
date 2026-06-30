import { NavigationContainer } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { LogBox, StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import BottomTabNavigator from './src/navigation/BottomTabNavigator';
import { stores } from './src/stores';

// The CartoDB Voyager basemap style (basemaps.cartocdn.com) ships boundary
// layers with a single-element line-dasharray at low zoom stops, which
// MapLibre Native logs as a warning on every style parse. We don't control
// that third-party style JSON, and the warning is harmless (MapLibre falls
// back to a solid line), so it's suppressed here.
LogBox.ignoreLogs(['line dasharray requires at least two elements']);

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
