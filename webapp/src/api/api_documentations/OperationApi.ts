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
            Passive = 0,
            Active = 1,
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
    }
    export namespace ListAll {
        export const path = "/operations";
        export interface Response {
            id: string;
            name: string;
            description: string;
            startDate: string;
            estimatedEndDate: string;
            endDate: string | null;
            operationStatus: Enums.OperationStatus;
            operationType: Enums.OperationType;
            createdAt: string;
            updatedAt: string | null;
        }
        export const call = async (searchValue?: string): Promise<ApiResponse<Response[]>> => {
            const response = await ApiClient.get(path, {
                params: {
                    search: searchValue
                }
            });
            return response.data;
        }
    }
    export namespace GetItemCounts {
        export const path = "/Operations/counts";
        export interface Response {
            activeCount: number;
            inactiveCount: number;
        }
        export const call = async (): Promise<ApiResponse<Response>> => {
            const response = await ApiClient.get(path);
            return response.data;
        }
    }
    export namespace Delete {
        export const path = "/Operations";
        export interface Request {
            id: string;
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
            createdAt: string;
            updatedAt: string | null;
        }
        export const call = async (request: Request): Promise<ApiResponse<Response>> => {
            const response = await ApiClient.delete(`${path}/${request.id}`);
            return response.data;
        }
    }
    export namespace Create {
        export const path = "/operations";
        export interface Request {
            name: string;
            description: string;
            startDate: string;
            estimatedEndDate: string;
            operationStatus: Enums.OperationStatus;
            operationType: Enums.OperationType;
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
            createdAt: string;
            updatedAt: string | null;
        }
        export const call = async (request: Request): Promise<ApiResponse<Response>> => {
            const response = await ApiClient.post(path, request);
            return response.data;
        }
    }
    export namespace Update {
        export const path = "/operations";
        export interface Request {
            id: string;
            name: string;
            description: string;
            startDate: string;
            estimatedEndDate: string;
            operationStatus: Enums.OperationStatus;
            operationType: Enums.OperationType;
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
            createdAt: string;
            updatedAt: string | null;
        }
        export const call = async (request: Request): Promise<ApiResponse<Response>> => {
            const response = await ApiClient.put(`${path}/${request.id}`, request);
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
            targetOperationAssetId: string | null;
            nextOrderId: string | null;
            previousOrderId: string | null;
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
        }
        export const call = async (request: Request): Promise<ApiResponse<Response>> => {
            const response = await ApiClient.get(`${path}/${request.id}`);
            return response.data;
        }
    }
    export namespace GetActivesByAgent {
        export const path = "/operations/GetActivesByAgent";
        export interface Request {
            agentId: string;
        }
        export interface AssetResponse {
            id: string;
            assetId: string;
            name: string;
            latitude: number;
            longitude: number;
            altitude: number;
            heading: number;
            speed: number;
            assetType: number;
            threatType: number;
            relatedAgentId: string | null;
        }
        export interface OrderResponse {
            id: string;
            description: string;
            issuedDate: string;
            completedDate: string;
            orderStatus: Enums.OrderStatus;
            orderType: Enums.OrderTypes;
            operationId: string;
            targetDatePeriodStart: string;
            targetDatePeriodEnd: string;
            targetPointLatitude: number;
            targetPointLongitude: number;
            targetPointAltitude: number;
            targetPointHeading: number;
            targetPointSpeed: number;
            responsibleOperationAssetId: string;
            targetOperationAssetId: string | null;
            nextOrderId: string | null;
            previousOrderId: string | null;
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
            operationAssets: AssetResponse[];
            orders: OrderResponse[];
        }
        export const call = async (request: Request): Promise<ApiResponse<Response[]>> => {
            const response = await ApiClient.post(path, request);
            return response.data;
        }
    }
    export namespace OperationAssets {
        export namespace Pick {
            export const path = "/operations/assets/pick";
            export interface Request {
                search: string;
                relationId: string;
            }
            export interface Response {
                id: string;
                name: string;
            }
            export const call = async (request: Request): Promise<ApiResponse<Response[]>> => {
                const response = await ApiClient.post(path, request);
                return response.data;
            }
        }
        export namespace Create {
            export const path = "/operations/assets";
            export interface Request {
                operationId: string;
                assetId: string;
            }
            export interface Response {
                id: string;
                operationId: string;
                assetId: string;
            }
            export const call = async (request: Request): Promise<ApiResponse<Response>> => {
                const response = await ApiClient.post(path, request);
                return response.data;
            }
        }
        export namespace Delete {
            export const path = "/operations/assets";
            export interface Request {
                id: string;
            }
            export interface Response {
                id: string;
                operationId: string;
                assetId: string;
            }
            export const call = async (request: Request): Promise<ApiResponse<Response>> => {
                const response = await ApiClient.delete(`${path}/${request.id}`);
                return response.data;
            }
        }
    }
    export namespace Orders {
        export namespace Create {
            export const path = "/operations/orders";
            export interface Request {
                operationId: string;
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
                nextOrderId: string | null;
                previousOrderId: string | null;
            }
            export interface Response {
                id: string;
                operationId: string;
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
                nextOrderId: string | null;
                previousOrderId: string | null;
                createdAt: string;
                updatedAt: string | null;
            }
            export const call = async (request: Request): Promise<ApiResponse<Response>> => {
                const response = await ApiClient.post(path, request);
                return response.data;
            }
        }
        export namespace Update {
            export const path = "/operations/orders";
            export interface Request {
                id: string;
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
                nextOrderId: string | null;
                previousOrderId: string | null;
            }
            export interface Response {
                id: string;
                operationId: string;
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
                nextOrderId: string | null;
                previousOrderId: string | null;
                createdAt: string;
                updatedAt: string | null;
            }
            export const call = async (request: Request): Promise<ApiResponse<Response>> => {
                const response = await ApiClient.put(`${path}/${request.id}`, request);
                return response.data;
            }
        }
        export namespace Delete {
            export const path = "/operations/orders";
            export interface Request {
                id: string;
            }
            export interface Response {
                id: string;
                operationId: string;
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
                nextOrderId: string | null;
                previousOrderId: string | null;
                createdAt: string;
                updatedAt: string | null;
            }
            export const call = async (request: Request): Promise<ApiResponse<Response>> => {
                const response = await ApiClient.delete(`${path}/${request.id}`);
                return response.data;
            }
        }
    }
}