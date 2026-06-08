import 'maplibre-gl/dist/maplibre-gl.css';
import { useEffect, useMemo, useState } from 'react';
import {
    Map,
    Marker,
    Popup,
    NavigationControl,
    FullscreenControl,
    ScaleControl,
    GeolocateControl
} from 'react-map-gl/maplibre';
import Pin from './markers/PinMarker';
import { stores } from '../../../stores';
import { MenuTypes } from '../../../types/MenuTypes';
import { observer } from 'mobx-react-lite';
import { AssetApi } from '../../../api';
import { AircraftMarker, AirGunMarker, BuildingMarker, PersonMarker, PersonGroupMarker, ShipMarker, SubmarineMarker, UnknownMarker, VehicleMarker, RadarMarker } from './markers';

interface Point {
    name: string;
    latitude: number;
    longitude: number;
}

export const CmsMap: React.FC = observer(() => {
    const [selectedMarker, setSelectedMarker] = useState<Point | undefined>(undefined);
    const { applicationStore, assetStore } = stores;

    useEffect(() => {
        if (assetStore.selectedItem != undefined) {
            setSelectedMarker({
                name: assetStore.selectedItem.name,
                latitude: assetStore.selectedItem.latitude,
                longitude: assetStore.selectedItem.longitude
            });
        } else {
            setSelectedMarker(undefined)
        }
    }, [assetStore.selectedItem])

    const renderPin = (item: AssetApi.ListAll.Response) => {
        switch (item.assetType) {
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

    const renderMarkers = () => {
        assetStore.allItems.forEach((item) => {
            console.log(item.latitude, item.longitude);
        })

        switch (applicationStore.currentMenu) {
            case MenuTypes.Assets:
                {
                    return assetStore.allItems.map((item, index) => (
                        <Marker
                            key={`marker-${index}`}
                            // latitude={item.latitude}
                            // longitude={item.longitude}
                            latitude={item.latitude}
                            longitude={item.longitude}
                            anchor="bottom"
                            onClick={e => {
                                e.originalEvent.stopPropagation();
                                assetStore.setSelectedItem(item);
                            }}
                        >
                            {renderPin(item)}
                        </Marker>
                    ))
                }
            default:
                {
                    return (<Marker
                        key={`marker-default`}
                        longitude={28.9784}
                        latitude={41.0082}
                        anchor="bottom"
                        onClick={e => {
                            e.originalEvent.stopPropagation();
                            // setPopupInfo(city as any);
                        }}
                    >
                        <Pin />
                    </Marker>)
                }
        }
    }


    return (
        <>
            <Map
                initialViewState={{ latitude: 41.0082, longitude: 28.9784, zoom: 10 }}
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
                            assetStore.setSelectedItem(undefined);
                        }}
                    >
                        <div>
                            {selectedMarker.name}
                        </div>
                    </Popup>
                )}
            </Map>
        </>
    );
});