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

interface City {
    city: string;
    population: number;
    latitude: number;
    longitude: number;
    image: string;
    state: string;
}

const CITIES: City[] = [
    { city: "Istanbul", population: 20175133, state: "Marmara", latitude: 41.0082, longitude: 28.9784, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Bosphorus_Bridge_%28235499411%29.jpeg/1920px-Bosphorus_Bridge_%28235499411%29.jpeg" },
];

export default function CmsMap() {
    const [popupInfo, setPopupInfo] = useState<City | null>(null);

    const pins = useMemo(
        () =>
            CITIES.map((city, index) => (
                <Marker
                    key={`marker-${index}`}
                    longitude={city.longitude}
                    latitude={city.latitude}
                    anchor="bottom"
                    onClick={e => {
                        // If we let the click event propagates to the map, it will immediately close the popup
                        // with `closeOnClick: true`
                        e.originalEvent.stopPropagation();
                        setPopupInfo(city as any);
                    }}
                >
                    <Pin />
                </Marker>
            )),
        []
    );

    return (
        <Map
            initialViewState={{ latitude: 41.0082, longitude: 28.9784, zoom: 8 }}
            style={{ width: '100%', height: '100vh' }}
            mapStyle="https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json"
        >
            <GeolocateControl position="top-left" />
            <FullscreenControl position="top-left" />
            <NavigationControl position="top-left" />
            <ScaleControl />
            {pins}

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
    );
}