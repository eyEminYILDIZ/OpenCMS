import { Camera, CameraRef, Map, Marker, useCurrentPosition, ViewAnnotation, ViewAnnotationRef } from '@maplibre/maplibre-react-native';
import { observer } from 'mobx-react-lite';
import React, { useCallback, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { MapControls, UserHeadingMarker } from '../components/map';
import { OperationHeader } from '../components/operation/OperationHeader';
import { AssetApi } from '../api';
import { stores } from '../stores';
import { useLocation } from '../hooks/useLocation';
import { useCompassHeading } from '../hooks/useCompassHeading';
import { colors } from '../theme/colors';
import { threatTypeColors } from '../types/enums/ThreatTypes';
import { getAssetMarker } from '../components/map/markers/getAssetMarker';
import { MapWrapper } from '../components/map/MapWrapper';
import { OrderLinksLayer, OrderMarker } from '../components/map/orders';

const MAP_STYLE_VOYAGER = 'https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json';

const MAP_STYLE_SATELLITE = {
  version: 8 as const,
  sources: {
    satellite: {
      type: 'raster' as const,
      tiles: ['https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'],
      tileSize: 256,
    },
  },
  layers: [
    {
      id: 'satellite',
      type: 'raster' as const,
      source: 'satellite',
    },
  ],
};
const DEFAULT_CENTER: [number, number] = [35.487361, 39.245472];
const DEFAULT_ZOOM = 5;



export const MapScreen = observer(() => {
  const { assetStore, operationStore, mapSettingsStore } = stores;
  const { t } = useTranslation();
  const cameraRef = useRef<CameraRef>(null);
  const { permissionState, requestPermission } = useLocation();
  const currentPosition = useCurrentPosition();
  const compassHeading = useCompassHeading();

  const prevAssetIdRef = useRef<string | undefined>(undefined);
  const prevOperationAssetIdRef = useRef<string | undefined>(undefined);
  const prevOrderIdRef = useRef<string | undefined>(undefined);
  const currentZoomRef = useRef(DEFAULT_ZOOM);
  const annotationRefs = useRef<Record<string, ViewAnnotationRef>>({});
  const prevHeadingsRef = useRef<Record<string, number>>({});

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

  const assetMarker = (assetType: AssetApi.Enums.AssetTypes, threatType: AssetApi.Enums.ThreatTypes): React.ReactElement =>
    getAssetMarker(assetType, { color: threatTypeColors[threatType] });

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
    if (operationStore.selectedOrder != null) {
      const { id, targetPointLatitude, targetPointLongitude } = operationStore.selectedOrder;
      const isNew = id !== prevOrderIdRef.current;
      prevOrderIdRef.current = id;
      flyToAsset(targetPointLatitude, targetPointLongitude, isNew);
    } else {
      prevOrderIdRef.current = undefined;
    }
  }, [operationStore.selectedOrder]);

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
      if (prevHeadingsRef.current[item.id] !== item.heading) {
        prevHeadingsRef.current[item.id] = item.heading;
        annotationRefs.current[`asset-${item.id}`]?.refresh();
      }
    });
  }, [headingsKey]);


  return (
    <MapWrapper>
      <OperationHeader />
      <Map
        style={styles.map}
        mapStyle={mapSettingsStore.satelliteView ? MAP_STYLE_SATELLITE : MAP_STYLE_VOYAGER}
        onPress={() => {
          assetStore.clearSelectedItems();
          operationStore.clearSelectedOrder();
        }}
        onRegionDidChange={(event) => {
          currentZoomRef.current = event.nativeEvent.zoom ?? currentZoomRef.current;
        }}
      >
        <Camera
          ref={cameraRef}
          initialViewState={{ center: DEFAULT_CENTER, zoom: DEFAULT_ZOOM }}
        />
        {permissionState === 'granted' && currentPosition?.coords && (
          <Marker
            id="user-location"
            lngLat={[currentPosition.coords.longitude, currentPosition.coords.latitude]}
          >
            <View style={{ transform: [{ rotate: `${compassHeading}deg` }] }}>
              <UserHeadingMarker />
            </View>
          </Marker>
        )}
        {operationStore.selectedItem != null && (
          <OrderLinksLayer orders={operationStore.selectedItem.orders} />
        )}
        {operationStore.selectedItem?.orders.map((item) => (
          <Marker
            key={`order-${item.id}`}
            id={`order-${item.id}`}
            lngLat={[item.targetPointLongitude, item.targetPointLatitude]}
            onPress={() => operationStore.setSelectedOrder(item)}
          >
            <OrderMarker code={item.code} orderType={item.orderType} />
          </Marker>
        ))}
        {operationStore.selectedOrder != null && (
          <Marker
            key={`order-popup-${operationStore.selectedOrder.id}`}
            id={`order-popup-${operationStore.selectedOrder.id}`}
            lngLat={[
              operationStore.selectedOrder.targetPointLongitude,
              operationStore.selectedOrder.targetPointLatitude,
            ]}
            anchor="bottom"
            offset={[0, -20]}
          >
            <View style={styles.popupBubble}>
              <Text style={styles.popupText}>{operationStore.selectedOrder.code}</Text>
              <Text style={styles.popupSubtext}>{operationStore.selectedOrder.description}</Text>
            </View>
          </Marker>
        )}
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
              {assetMarker(item.assetType, item.threatType)}
            </View>
          </ViewAnnotation>
        ))}
        {assetStore.selectedItem != null && (
          <ViewAnnotation
            key={`asset-popup-${assetStore.selectedItem.id}`}
            id={`asset-popup-${assetStore.selectedItem.id}`}
            lngLat={[assetStore.selectedItem.longitude, assetStore.selectedItem.latitude]}
            anchor="bottom"
            offset={[0, -20]}
          >
            <View style={styles.popupBubble}>
              <Text style={styles.popupText}>{assetStore.selectedItem.name}</Text>
            </View>
          </ViewAnnotation>
        )}
      </Map>
      <MapControls
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onMyLocation={handleMyLocation}
      />
    </MapWrapper>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  map: {
    flex: 1
  },
  popupBubble: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  popupText: {
    color: colors.cardForeground,
    fontSize: 13,
    fontWeight: '600',
  },
  popupSubtext: {
    color: colors.mutedForeground,
    fontSize: 12,
    marginTop: 2,
  },

});
