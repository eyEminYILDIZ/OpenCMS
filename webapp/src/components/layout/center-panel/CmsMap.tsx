import 'maplibre-gl/dist/maplibre-gl.css';
import { useMemo, useState } from 'react';
import {
    Map,
    Marker,
    Popup,
    NavigationControl,
    FullscreenControl,
    ScaleControl,
    GeolocateControl
} from 'react-map-gl/maplibre';
import Pin from './Pin';
import { stores } from '../../../stores';
import { MenuTypes } from '../../../types/MenuTypes';
import { observer } from 'mobx-react-lite';

interface City {
    city: string;
    population: number;
    latitude: number;
    longitude: number;
    image: string;
    state: string;
}

export const CmsMap: React.FC = observer(() => {
    const [popupInfo, setPopupInfo] = useState<City | null>(null);
    const { applicationStore, assetStore } = stores;

    const renderPins = () => {
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
                                // setPopupInfo(item as any);
                            }}
                        >
                            <Pin />
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

                {renderPins()}

                {popupInfo && (
                    <Popup
                        anchor="top"
                        longitude={Number(popupInfo.longitude)}
                        latitude={Number(popupInfo.latitude)}
                        onClose={() => setPopupInfo(null)}
                    >
                        <div>
                            {popupInfo.city}, {popupInfo.state}
                        </div>
                        <img width="100%" src={popupInfo.image} />
                    </Popup>
                )}
            </Map>
        </>
    );
});