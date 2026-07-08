import { ApiResponse } from "../ApiModels";
import { ApiClient } from "../axios_setup";

export namespace OperationApi {
    export namespace Enums {
        export enum OperationStatus {
            NotStarted = 0,
            InProgress = 1,
            Completed = 2,
            OnHold = 3,
            Cancelled = 4,
        }
        export enum OperationType {
            Intercept = 0,
            Rescue = 1,
            Capture = 2,
            Exterminate = 3,
            Exchange = 4,
        }
        export enum OrderStatus {
            NotStarted = 0,
            Started = 1,
            Completed = 2,
            Cancelled = 3,
            Failed = 4,
            Unknown = 5,
        }
        export enum OrderTypes {
            Move = 0,
            Attack = 1,
            Defend = 2,
            GatherIntelligence = 3,
            Exchange = 4,
            Take = 5,
            Give = 6,
        }
        export enum DispatchCategories {
            General = 0,
            Asset = 1,
            Agent = 2,
            Operation = 3,
        }
    }

    export namespace GetActivesByAgent {
        export const path = "/operations/GetActivesByAgent";
        export interface Request {
            agentId: string;
        }
        export interface Response {
            id: string;
            name: string;
            description: string;
            startDate: string;
            estimatedEndDate: string;
            endDate: string | null;
            operationStatus: Enums.OperationStatus;
            operationType: Enums.OperationType;
        }
        export const call = async (request: Request): Promise<ApiResponse<Response[]>> => {
            const response = await ApiClient.post(path, request);
            return response.data;
        }
    }

    export namespace GetById {
        export const path = "/operations";
        export interface Request {
            id: string;
        }
        export interface OrderResponse {
            id: string;
            code: string;
            description: string;
            issuedDate: string;
            completedDate: string;
            orderStatus: Enums.OrderStatus;
            orderType: Enums.OrderTypes;
            targetDatePeriodStart: string;
            targetDatePeriodEnd: string;
            targetPointLatitude: number;
            targetPointLongitude: number;
            targetPointAltitude: number;
            targetPointHeading: number;
            targetPointSpeed: number;
            responsibleOperationAssetId: string;
            responsibleOperationAssetName: string;
            targetOperationAssetId: string | null;
            nextOrderId: string | null;
            previousOrderId: string | null;
            previousOrderDescription: string | null;
        }
        export interface AssetResponse {
            id: string;
            name: string;
            latitude: number;
            longitude: number;
            altitude: number;
            heading: number;
            speed: number;
            assetType: number;
            threatType: number;
            firstUpdated: string;
            lastUpdated: string;
            isActive: boolean;
            relatedAgentId: string | null;
        }
        export interface OperationAssetResponse {
            id: string;
            assetId: string;
            asset: AssetResponse;
        }
        export interface DispatchResponse {
            id: string;
            title: string;
            description: string;
            category: Enums.DispatchCategories;
            occuredAt: string;
            relatedEntityId: string;
            relatedChildEntityId: string | null;
            providerAgentId: string;
            providerAgentName: string;
            createdAt: string;
            updatedAt: string | null;
        }
        export interface Response {
            id: string;
            name: string;
            description: string;
            startDate: string;
            estimatedEndDate: string;
            endDate: string | null;
            operationStatus: Enums.OperationStatus;
            operationType: Enums.OperationType;
            orders: OrderResponse[];
            operationAssets: OperationAssetResponse[];
            dispatches: DispatchResponse[];
        }
        export const call = async (request: Request): Promise<ApiResponse<Response>> => {
            const response = await ApiClient.get(`${path}/${request.id}`);
            return response.data;
        }
    }
}
