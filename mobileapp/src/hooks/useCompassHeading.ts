import { useEffect, useState } from 'react';
import CompassHeading from 'react-native-compass-heading';

const DEGREE_UPDATE_RATE = 3;

interface CompassHeadingData {
  heading: number;
  accuracy: number;
}

export function useCompassHeading(): number {
  const [heading, setHeading] = useState(0);

  useEffect(() => {
    CompassHeading.start(DEGREE_UPDATE_RATE, ({ heading: newHeading }: CompassHeadingData) => {
      setHeading(newHeading);
    });

    return () => {
      CompassHeading.stop();
    };
  }, []);

  return heading;
}
