import { useCallback, useState } from 'react';
import './styles/globals.css';
import SplashScreen from './components/SplashScreen';
import AppLayout from './components/layout/AppLayout';

const App = () => {
  const [splashDone, setSplashDone] = useState(false);
  const handleSplashDone = useCallback(() => setSplashDone(true), []);

  if (!splashDone) {
    return <SplashScreen duration={2000} onDone={handleSplashDone} />;
  }

  return <AppLayout />;
};

export default App;
