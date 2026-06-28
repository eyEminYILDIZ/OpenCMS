import { useCallback, useRef, useState } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';

export type LocationCoords = { latitude: number; longitude: number };

export type LocationState = 'idle' | 'granted' | 'denied';

export function useLocation() {
  const [permissionState, setPermissionState] = useState<LocationState>('idle');
  const currentPosition = useRef<LocationCoords | null>(null);

  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (Platform.OS === 'android') {
      const result = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'OpenCMS needs your location to show your position on the map.',
          buttonPositive: 'Allow',
          buttonNegative: 'Deny',
        },
      );
      const granted = result === PermissionsAndroid.RESULTS.GRANTED;
      setPermissionState(granted ? 'granted' : 'denied');
      return granted;
    }
    // iOS: permission is requested automatically by the OS when UserLocation renders
    setPermissionState('granted');
    return true;
  }, []);

  const updatePosition = useCallback((coords: LocationCoords) => {
    currentPosition.current = coords;
  }, []);

  const getPosition = useCallback(() => currentPosition.current, []);

  return { permissionState, requestPermission, updatePosition, getPosition };
}
