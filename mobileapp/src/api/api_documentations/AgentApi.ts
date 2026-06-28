import { ApiResponse } from "../ApiModels";
import { ApiClient } from "../axios_setup";

export namespace AgentApi {
    export namespace Enums {
        export enum AgentTypes {
            ComputerProgram = 0,
            Person = 1,
            InputOutput = 2,
            InputOnly = 3,
            OutputOnly = 4,
        }
    }

    export namespace ListAll {
        export const path = "/agents";
        export interface Response {
            id: string;
            name: string;
            description: string;
            agentType: Enums.AgentTypes;
            lastSeen: string;
            isActive: boolean;
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

    export namespace Ping {
        export const path = "/agents";
        export interface Request {
            id: string;
            sentAt: string;
        }
        export interface Response {
            id: string;
            name: string;
            description: string;
            agentType: Enums.AgentTypes;
            lastSeen: string;
            isActive: boolean;
            createdAt: string;
            updatedAt: string | null;
        }
        export const call = async (request: Request): Promise<ApiResponse<Response>> => {
            const response = await ApiClient.put(`${path}/${request.id}/ping`, { sentAt: request.sentAt });
            return response.data;
        }
    }
}
