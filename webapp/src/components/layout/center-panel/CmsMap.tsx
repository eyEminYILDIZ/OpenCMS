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
import { AircraftMarker, AirGunMarker, BuildingMarker, PersonGroupMarker, PersonMarker, RadarMarker, ShipMarker, SubmarineMarker, UnknownMarker, VehicleMarker } from './markers';
import Pin from './markers/PinMarker';

interface Point {
    name: string;
    latitude: number;
    longitude: number;
}


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
    }, [assetStore.selectedItem, operationStore.selectedAsset]);


    const renderPin = (assetType: AssetApi.Enums.AssetTypes) => {
        switch (assetType) {
            case AssetApi.Enums.AssetTypes.Aircraft:
                return <AircraftMarker />;
            case AssetApi.Enums.AssetTypes.Ship:
                return <ShipMarker />;
            case AssetApi.Enums.AssetTypes.Submarine:
                return <SubmarineMarker />;
            case AssetApi.Enums.AssetTypes.Vehicle:
                return <VehicleMarker />;
            case AssetApi.Enums.AssetTypes.Building:
                return <BuildingMarker />;
            case AssetApi.Enums.AssetTypes.Person:
                return <PersonMarker />;
            case AssetApi.Enums.AssetTypes.GroupOfPeople:
                return <PersonGroupMarker />;
            case AssetApi.Enums.AssetTypes.Radar:
                return <RadarMarker />;
            case AssetApi.Enums.AssetTypes.AirGun:
                return <AirGunMarker />;
            case AssetApi.Enums.AssetTypes.Other:
                return <UnknownMarker />;
            case AssetApi.Enums.AssetTypes.Unknown:
            default:
                return <UnknownMarker />;
        }
    }

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
                        operationStore.selectedItem.assets.forEach((item) => {
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
                            {renderPin(item.assetType)}
                        </Marker>
                    ))
                }
            case MenuTypes.Operations:
                {
                    if (operationStore.selectedItem != undefined)
                        return operationStore.selectedItem.assets.map((item, index) => (
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
                                }}
                            >
                                {renderPin(item.asset.assetType)}
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
                mapStyle="https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json"
            >
                <GeolocateControl position="top-left" />
                <FullscreenControl position="top-left" />
                <NavigationControl position="top-left" />
                <ScaleControl />

                {renderMarkers()}

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