import 'maplibre-gl/dist/maplibre-gl.css';
import { observer } from 'mobx-react-lite';
import { useEffect, useRef, useState } from 'react';
import {
    FullscreenControl,
    GeolocateControl,
    Map,
    MapRef,
    Marker,
    NavigationControl,
    Popup,
    ScaleControl
} from 'react-map-gl/maplibre';
import { AssetApi } from '../../../api';
import { stores } from '../../../stores';
import { MenuTypes } from '../../../types/MenuTypes';
import { MapControls } from './MapControls';
import { getAssetMarker } from './markers/getAssetMarker';
import { orderTypeCodeLetters, orderTypeColors, PanelModes } from '../../../types';
import { OperationTabs } from '../../../stores/OperationStore';
import { threatTypeColors } from '../../../types/enums/ThreatTypes';
import { OrderCodeMarker } from './orders/getOperationIcon';

interface Point {
    name: string;
    latitude: number;
    longitude: number;
}


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

const defaultViewState = {
    latitude: 39.245472,
    longitude: 35.487361,
    zoom: 5
};

export const CmsMap: React.FC = observer(() => {
    const mapRef = useRef<MapRef>(null);
    const [selectedMarker, setSelectedMarker] = useState<Point | undefined>(undefined);
    const [initialViewState, setInitialViewState] = useState(defaultViewState);
    const { applicationStore, assetStore, operationStore, mapSettingsStore } = stores;

    // Track last selected IDs to distinguish new selection from position update
    const prevAssetIdRef = useRef<string | undefined>(undefined);
    const prevOperationAssetIdRef = useRef<string | undefined>(undefined);

    const flyToAsset = (latitude: number, longitude: number, zoom: number, name: string, isNewSelection: boolean) => {
        setSelectedMarker({ name, latitude, longitude });

        const { automaticTracking, automaticFocusing } = mapSettingsStore;

        if (isNewSelection && automaticFocusing) {
            // New selection + focusing on: center and zoom in
            mapRef.current?.flyTo({ center: [longitude, latitude], zoom, duration: 2000 });
        } else if (automaticTracking) {
            // Position update (or new selection) with tracking on: follow without changing zoom
            // If focusing is also on, keep zoom from focusing; otherwise lock current zoom
            const targetZoom = automaticFocusing ? zoom : (mapRef.current?.getZoom() ?? zoom);
            mapRef.current?.flyTo({ center: [longitude, latitude], zoom: targetZoom, duration: 2000 });
        }
    };

    useEffect(() => {
        switch (applicationStore.currentMenu) {
            case MenuTypes.Assets:
                if (assetStore.selectedItem != undefined) {
                    const { id, latitude, longitude, name } = assetStore.selectedItem;
                    const isNewSelection = id !== prevAssetIdRef.current;
                    prevAssetIdRef.current = id;
                    flyToAsset(latitude, longitude, 14, name, isNewSelection);
                } else {
                    prevAssetIdRef.current = undefined;
                    assetStore.clearSelectedItems();
                    setSelectedMarker(undefined);
                }
                break;
            case MenuTypes.Operations:
                if (operationStore.selectedAsset != undefined) {
                    const { asset } = operationStore.selectedAsset;
                    const isNewSelection = asset.id !== prevOperationAssetIdRef.current;
                    prevOperationAssetIdRef.current = asset.id;
                    flyToAsset(asset.latitude, asset.longitude, 14, asset.name, isNewSelection);
                } else {
                    prevOperationAssetIdRef.current = undefined;
                    operationStore.clearSelectedAsset();
                    setSelectedMarker(undefined);
                }
                break;
            default:
                break;
        }
    }, [assetStore.selectedItem, operationStore.selectedAsset, operationStore.selectedAsset?.asset]);

    useEffect(() => {
        switch (applicationStore.currentMenu) {
            case MenuTypes.Assets:
                break;
            case MenuTypes.Operations:
                {
                    const { automaticTracking, automaticFocusing } = mapSettingsStore;
                    if (!automaticTracking && !automaticFocusing) break;

                    let left = 180;
                    let right = 0;
                    let top = -90;
                    let bottom = 90;
                    if (operationStore.selectedItem != undefined) {
                        operationStore.selectedItem.operationAssets.forEach((item) => {
                            if (item.asset.latitude > top) top = item.asset.latitude;
                            if (item.asset.latitude < bottom) bottom = item.asset.latitude;
                            if (item.asset.longitude > right) right = item.asset.longitude;
                            if (item.asset.longitude < left) left = item.asset.longitude;
                        });
                        // focusing: fit all assets in view with zoom; tracking alone: pan to center only
                        if (automaticFocusing) {
                            mapRef.current?.fitBounds([[left, bottom], [right, top]], { padding: 250, duration: 2000 });
                        } else {
                            const centerLng = (left + right) / 2;
                            const centerLat = (top + bottom) / 2;
                            mapRef.current?.flyTo({ center: [centerLng, centerLat], zoom: mapRef.current?.getZoom() ?? defaultViewState.zoom, duration: 2000 });
                        }
                    } else {
                        const cx = defaultViewState.longitude;
                        const cy = defaultViewState.latitude;
                        if (automaticFocusing) {
                            mapRef.current?.fitBounds([[cx - 3, cy - 8], [cx + 3, cy + 8]], { padding: 0, duration: 2000 });
                        } else {
                            mapRef.current?.flyTo({ center: [cx, cy], zoom: mapRef.current?.getZoom() ?? defaultViewState.zoom, duration: 2000 });
                        }
                    }
                }
            default:
                break;
        }

    }, [applicationStore.currentMenu, assetStore.allItems, operationStore.selectedItem]);

    const renderMarkers = () => {
        // assetStore.allItems.forEach((item) => {
        //     console.log(item.latitude, item.longitude);
        // })

        switch (applicationStore.currentMenu) {
            case MenuTypes.Assets:
                {
                    return assetStore.allItems.map((item, index) => (
                        <Marker
                            key={`marker-${index}`}
                            latitude={item.latitude}
                            longitude={item.longitude}
                            anchor="bottom"
                            rotation={item.heading}
                            rotationAlignment="map"
                            onClick={e => {
                                e.originalEvent.stopPropagation();
                                assetStore.setSelectedItem(item);
                            }}
                        >
                            {getAssetMarker(item.assetType, { color: threatTypeColors[item.threatType] })}
                        </Marker>
                    ))
                }
            case MenuTypes.Operations:
                {
                    if (operationStore.selectedItem != undefined)
                        return operationStore.selectedItem.operationAssets.map((item, index) => (
                            <Marker
                                key={`marker-${index}`}
                                latitude={item.asset.latitude}
                                longitude={item.asset.longitude}
                                anchor="bottom"
                                rotation={item.asset.heading}
                                rotationAlignment="map"
                                onClick={e => {
                                    e.originalEvent.stopPropagation();
                                    operationStore.setSelectedAsset(item);
                                    operationStore.setSelectedTab(OperationTabs.Assets);
                                    operationStore.setPanelMode(PanelModes.Detail);
                                }}
                            >
                                {getAssetMarker(item.asset.assetType, { color: threatTypeColors[item.asset.threatType as keyof typeof threatTypeColors] })}
                            </Marker>
                        ))
                }
            default:
                {
                    // return (<Marker
                    //     key={`marker-default`}
                    //     longitude={28.9784}
                    //     latitude={41.0082}
                    //     anchor="bottom"
                    //     onClick={e => {
                    //         e.originalEvent.stopPropagation();
                    //         // setPopupInfo(city as any);
                    //     }}
                    // >
                    //     <Pin />
                    // </Marker>)
                }
        }
    }

    const renderOrders = () => {
        switch (applicationStore.currentMenu) {
            case MenuTypes.Operations:
                {
                    if (operationStore.selectedItem == undefined)
                        return (<></>);

                    return operationStore.selectedItem.orders.map((item, index) => (
                        <Marker
                            key={`marker-${index}`}
                            latitude={item.targetPointLatitude}
                            longitude={item.targetPointLongitude}
                            anchor="bottom"
                            rotation={item.targetPointHeading}
                            rotationAlignment="map"
                            onClick={e => {
                                e.originalEvent.stopPropagation();
                                operationStore.setSelectedOrder(item);
                                operationStore.setSelectedTab(OperationTabs.Orders);
                                operationStore.setPanelMode(PanelModes.Detail);
                            }}
                        >
                            <OrderCodeMarker
                                code={item.code}
                                orderType={item.orderType}
                                color={"gray"}
                            />
                        </Marker>
                    ))
                }
            default:
                {
                    // return (<Marker
                    //     key={`marker-default`}
                    //     longitude={28.9784}
                    //     latitude={41.0082}
                    //     anchor="bottom"
                    //     onClick={e => {
                    //         e.originalEvent.stopPropagation();
                    //         // setPopupInfo(city as any);
                    //     }}
                    // >
                    //     <Pin />
                    // </Marker>)
                }
        }
    }


    return (
        <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
            <Map
                ref={mapRef}
                initialViewState={initialViewState}
                style={{ width: '100%', height: '100vh' }}
                mapStyle={mapSettingsStore.satelliteView ? MAP_STYLE_SATELLITE : MAP_STYLE_VOYAGER}
            >
                <GeolocateControl position="top-left" />
                <FullscreenControl position="top-left" />
                <NavigationControl position="top-left" />
                <ScaleControl />

                {renderMarkers()}
                {renderOrders()}

                {selectedMarker != undefined && (
                    <Popup
                        anchor="top"
                        longitude={Number(selectedMarker.longitude)}
                        latitude={Number(selectedMarker.latitude)}
                        onClose={() => {
                            setSelectedMarker(undefined);
                            assetStore.clearSelectedItems();
                        }}
                    >
                        <div>
                            {selectedMarker.name}
                        </div>
                    </Popup>
                )}
            </Map>
            <MapControls />
        </div>
    );
});