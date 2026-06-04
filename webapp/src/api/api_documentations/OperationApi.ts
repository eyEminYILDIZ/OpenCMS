import { ApiResponse } from "../ApiModels";
import { ApiClient } from "../axios_setup";

export namespace OperationApi {
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