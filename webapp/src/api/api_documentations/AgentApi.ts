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
        export const call = async (): Promise<ApiResponse<Response[]>> => {
            const response = await ApiClient.get(path);
            return response.data;
        }
    }
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
    export namespace Delete {
        export const path = "/Agents";
        export interface Request {
            id: string;
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
            const response = await ApiClient.delete(`${path}/${request.id}`);
            return response.data;
        }
    }
}