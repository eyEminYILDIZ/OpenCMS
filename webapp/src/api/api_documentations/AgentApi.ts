import { ApiResponse } from "../ApiModels";
import { ApiClient } from "../axios_setup";

export namespace AgentApi {
    export namespace GetItemCounts {
        export const path = "/Agents/counts";
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