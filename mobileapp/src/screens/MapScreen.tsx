import { Camera, Callout, CameraRef, Map, useCurrentPosition, UserLocation, ViewAnnotation, ViewAnnotationRef } from '@maplibre/maplibre-react-native';
import { observer } from 'mobx-react-lite';
import React, { useCallback, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import Toast from 'react-native-toast-message';
import { MapControls } from '../components/map/MapControls';
import { AssetApi } from '../api';
import { stores } from '../stores';
import { useLocation } from '../hooks/useLocation';
import {
  AircraftMarker,
  AirGunMarker,
  BuildingMarker,
  PersonGroupMarker,
  PersonMarker,
  RadarMarker,
  ShipMarker,
  SubmarineMarker,
  UnknownMarker,
  VehicleMarker,
} from '../components/map/markers';

const MAP_STYLE = 'https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json';
const DEFAULT_CENTER: [number, number] = [35.487361, 39.245472];
const DEFAULT_ZOOM = 5;



export const MapScreen = observer(() => {
  const { assetStore, operationStore, mapSettingsStore } = stores;
  const { t } = useTranslation();
  const cameraRef = useRef<CameraRef>(null);
  const { permissionState, requestPermission } = useLocation();
  const currentPosition = useCurrentPosition();

  const prevAssetIdRef = useRef<string | undefined>(undefined);
  const prevOperationAssetIdRef = useRef<string | undefined>(undefined);
  const currentZoomRef = useRef(DEFAULT_ZOOM);
  const annotationRefs = useRef<Record<string, ViewAnnotationRef>>({});

  useEffect(() => {
    requestPermission();
  }, [requestPermission]);

  const handleMyLocation = useCallback(() => {
    if (!currentPosition?.coords) {
      Toast.show({ type: 'error', text1: t('mapControls.locationUnavailable') });
      return;
    }
    const { latitude, longitude } = currentPosition.coords;
    cameraRef.current?.flyTo({ center: [longitude, latitude], zoom: 14, duration: 1500 });
  }, [currentPosition, t]);

  const assetMarker = (assetType: AssetApi.Enums.AssetTypes): React.ReactElement => {
    switch (assetType) {
      case AssetApi.Enums.AssetTypes.Aircraft: return <AircraftMarker />;
      case AssetApi.Enums.AssetTypes.Ship: return <ShipMarker />;
      case AssetApi.Enums.AssetTypes.Submarine: return <SubmarineMarker />;
      case AssetApi.Enums.AssetTypes.Vehicle: return <VehicleMarker />;
      case AssetApi.Enums.AssetTypes.Building: return <BuildingMarker />;
      case AssetApi.Enums.AssetTypes.Person: return <PersonMarker />;
      case AssetApi.Enums.AssetTypes.GroupOfPeople: return <PersonGroupMarker />;
      case AssetApi.Enums.AssetTypes.Radar: return <RadarMarker />;
      case AssetApi.Enums.AssetTypes.AirGun: return <AirGunMarker />;
      default: return <UnknownMarker />;
    }
  }

  const handleZoomIn = () => {
    const newZoom = Math.min(currentZoomRef.current + 1, 22);
    cameraRef.current?.zoomTo(newZoom, { duration: 300 });
  };

  const handleZoomOut = () => {
    const newZoom = Math.max(currentZoomRef.current - 1, 0);
    cameraRef.current?.zoomTo(newZoom, { duration: 300 });
  };

  const flyToAsset = (latitude: number, longitude: number, isNewSelection: boolean) => {
    const { automaticTracking, automaticFocusing } = mapSettingsStore;
    if (isNewSelection && automaticFocusing) {
      cameraRef.current?.flyTo({ center: [longitude, latitude], zoom: 14, duration: 2000 });
    } else if (automaticTracking) {
      cameraRef.current?.flyTo({ center: [longitude, latitude], duration: 2000 });
    }
  };

  useEffect(() => {
    if (assetStore.selectedItem != null) {
      const { id, latitude, longitude } = assetStore.selectedItem;
      const isNew = id !== prevAssetIdRef.current;
      prevAssetIdRef.current = id;
      flyToAsset(latitude, longitude, isNew);
    } else {
      prevAssetIdRef.current = undefined;
    }
  }, [assetStore.selectedItem]);

  useEffect(() => {
    if (operationStore.selectedAsset != null) {
      const { asset } = operationStore.selectedAsset;
      const isNew = asset.id !== prevOperationAssetIdRef.current;
      prevOperationAssetIdRef.current = asset.id;
      flyToAsset(asset.latitude, asset.longitude, isNew);
    } else {
      prevOperationAssetIdRef.current = undefined;
    }
  }, [operationStore.selectedAsset, operationStore.selectedAsset?.asset]);

  useEffect(() => {
    const { automaticTracking, automaticFocusing } = mapSettingsStore;
    if (!automaticTracking && !automaticFocusing) return;

    if (operationStore.selectedItem != null) {
      const assets = operationStore.selectedItem.operationAssets;
      if (assets.length === 0) return;

      let west = 180, east = -180, south = 90, north = -90;
      assets.forEach(({ asset }) => {
        if (asset.longitude < west) west = asset.longitude;
        if (asset.longitude > east) east = asset.longitude;
        if (asset.latitude < south) south = asset.latitude;
        if (asset.latitude > north) north = asset.latitude;
      });

      if (automaticFocusing) {
        cameraRef.current?.fitBounds(
          [west, south, east, north],
          { padding: { top: 50, right: 50, bottom: 50, left: 50 }, duration: 2000 },
        );
      } else {
        cameraRef.current?.flyTo({
          center: [(west + east) / 2, (south + north) / 2],
          duration: 2000,
        });
      }
    }
  }, [operationStore.selectedItem, assetStore.allItems]);

  const headingsKey = assetStore.allItems.map((item) => `${item.id}:${item.heading}`).join(',');

  useEffect(() => {
    assetStore.allItems.forEach((item) => {
      annotationRefs.current[`asset-${item.id}`]?.refresh();
    });
  }, [headingsKey]);

  return (
    <View style={styles.container}>
      <Map
        style={styles.map}
        mapStyle={MAP_STYLE}
        onRegionDidChange={(event) => {
          currentZoomRef.current = event.nativeEvent.zoom ?? currentZoomRef.current;
        }}
      >
        <Camera
          ref={cameraRef}
          initialViewState={{ center: DEFAULT_CENTER, zoom: DEFAULT_ZOOM }}
        />
        {permissionState === 'granted' && <UserLocation animated heading />}
        {assetStore.allItems.map((item) => (
          <ViewAnnotation
            key={`asset-${item.id}`}
            id={`asset-${item.id}`}
            ref={(annotationRef) => {
              if (annotationRef) {
                annotationRefs.current[`asset-${item.id}`] = annotationRef;
              } else {
                delete annotationRefs.current[`asset-${item.id}`];
              }
            }}
            lngLat={[item.longitude, item.latitude]}
            title={item.name}
            onPress={() => assetStore.setSelectedItem(item)}
          >
            <View style={{ transform: [{ rotate: `${item.heading}deg` }] }}>
              {assetMarker(item.assetType)}
            </View>
            <Callout title={item.name} />
          </ViewAnnotation>
        ))}
      </Map>
      <MapControls
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onMyLocation={handleMyLocation}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
});
