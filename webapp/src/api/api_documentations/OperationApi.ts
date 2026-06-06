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
        export const call = async (): Promise<ApiResponse<Response[]>> => {
            const response = await ApiClient.get(path);
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
}