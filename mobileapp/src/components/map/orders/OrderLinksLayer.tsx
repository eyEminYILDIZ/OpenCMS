import { GeoJSONSource, Layer } from '@maplibre/maplibre-react-native';
import { useMemo } from 'react';
import { OperationApi } from '../../../api';
import { buildOrderLinks } from './buildOrderLinks';

interface OrderLinksLayerProps {
    orders: OperationApi.GetById.OrderResponse[];
}

/**
 * Draws straight-line connections between related orders (e.g. an order and its
 * previous order) on the map. Backed by a single GeoJSON source so new link kinds
 * (see `OrderLinkKind`) can be styled by adding more `Layer`s filtered on `kind`,
 * without changing how the data is sourced.
 */
export function OrderLinksLayer({ orders }: OrderLinksLayerProps): React.ReactElement {
    const data = useMemo(() => buildOrderLinks(orders), [orders]);

    return (
        <GeoJSONSource id="order-links" data={data}>
            <Layer
                id="order-links-previous"
                type="line"
                layout={{
                    'line-join': 'round',
                    'line-cap': 'round',
                }}
                paint={{
                    'line-color': ['get', 'color'],
                    'line-width': 3,
                    'line-dasharray': [2, 1.5],
                }}
            />
        </GeoJSONSource>
    );
}
