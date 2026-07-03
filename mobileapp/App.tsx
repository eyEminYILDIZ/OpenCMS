import { NavigationContainer } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { LogBox, StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import SplashScreen from './src/components/SplashScreen';
import BottomTabNavigator from './src/navigation/BottomTabNavigator';
import { stores } from './src/stores';

// The CartoDB Voyager basemap style (basemaps.cartocdn.com) ships boundary
// layers with a single-element line-dasharray at low zoom stops, which
// MapLibre Native logs as a warning on every style parse. We don't control
// that third-party style JSON, and the warning is harmless (MapLibre falls
// back to a solid line), so it's suppressed here.
LogBox.ignoreLogs(['line dasharray requires at least two elements']);

// Minimum time the splash screen stays up, giving applicationStore.initialize()
// a window to fetch data before the app renders.
const MIN_SPLASH_DURATION_MS = 2500;

export default function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const { applicationStore, agentStore, assetStore, operationStore } = stores;
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    Promise.all([
      applicationStore.initialize(),
      new Promise<void>(resolve => setTimeout(() => resolve(), MIN_SPLASH_DURATION_MS)),
    ]).then(() => {
      if (!cancelled) {
        setIsReady(true);
      }
    });

    return () => {
      cancelled = true;
    };
  }, []);

  if (!isReady) {
    return <SplashScreen />;
  }

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
