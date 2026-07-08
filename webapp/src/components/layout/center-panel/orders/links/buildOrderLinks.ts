import type { Feature, FeatureCollection, LineString } from 'geojson';
import { OperationApi } from '../../../../../api';
import { orderTypeColors } from '../../../../../types';

/**
 * Kinds of relationships between orders that can be drawn as a link on the map.
 * Add a new case here (and a matching branch in `buildOrderLinks`) to draw more
 * connection types in the future (e.g. next order, responsible asset, target asset).
 */
export enum OrderLinkKind {
    PreviousOrder = 'previousOrder',
}

export interface OrderLinkProperties {
    kind: OrderLinkKind;
    orderId: string;
    linkedOrderId: string;
    color: string;
}

export type OrderLinkFeature = Feature<LineString, OrderLinkProperties>;
export type OrderLinkCollection = FeatureCollection<LineString, OrderLinkProperties>;

const EMPTY_LINKS: OrderLinkCollection = { type: 'FeatureCollection', features: [] };

function previousOrderLink(
    order: OperationApi.GetById.OrderResponse,
    previousOrder: OperationApi.GetById.OrderResponse,
): OrderLinkFeature {
    return {
        type: 'Feature',
        properties: {
            kind: OrderLinkKind.PreviousOrder,
            orderId: order.id,
            linkedOrderId: previousOrder.id,
            color: orderTypeColors[order.orderType],
        },
        geometry: {
            type: 'LineString',
            coordinates: [
                [previousOrder.targetPointLongitude, previousOrder.targetPointLatitude],
                [order.targetPointLongitude, order.targetPointLatitude],
            ],
        },
    };
}

/**
 * Builds the GeoJSON feature collection of straight lines connecting orders to one
 * another (currently: an order to its previous order, when both are present in `orders`).
 */
export function buildOrderLinks(orders: OperationApi.GetById.OrderResponse[]): OrderLinkCollection {
    if (orders.length === 0) return EMPTY_LINKS;

    const ordersById = new Map(orders.map((order) => [order.id, order]));
    const features: OrderLinkFeature[] = [];

    orders.forEach((order) => {
        if (!order.previousOrderId) return;

        const previousOrder = ordersById.get(order.previousOrderId);
        if (!previousOrder) return;

        features.push(previousOrderLink(order, previousOrder));
    });

    return { type: 'FeatureCollection', features };
}
