import { useEffect, useState } from 'react';

interface SplashScreenProps {
  duration?: number;
  onDone: () => void;
}

const SplashScreen = ({ duration = 2000, onDone }: SplashScreenProps) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onDone();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onDone]);

  if (!visible) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#efefed',
        zIndex: 9999,
      }}
    >
      <img
        src="/assets/img/logo-wide.png"
        alt="OpenCMS"
        style={{ maxWidth: '400px', width: '80%' }}
      />
    </div>
  );
};

export default SplashScreen;
