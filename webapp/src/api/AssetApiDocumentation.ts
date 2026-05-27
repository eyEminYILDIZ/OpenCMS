import { ApiResponse } from "./ApiModels";
import { ApiClient } from "./axios_setup";

export namespace AssetApi {
    export namespace GetItemCounts {
        export const path = "/Assets/counts";
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