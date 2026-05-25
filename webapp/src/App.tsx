import { useCallback, useState } from 'react';
import './styles/globals.css';
import SplashScreen from './components/SplashScreen';
import StudentsPage from './pages/StudentsPage';

const App = () => {
  const [splashDone, setSplashDone] = useState(false);
  const handleSplashDone = useCallback(() => setSplashDone(true), []);

  if (!splashDone) {
    return <SplashScreen duration={2000} onDone={handleSplashDone} />;
  }

  return <StudentsPage />;
};

export default App;
