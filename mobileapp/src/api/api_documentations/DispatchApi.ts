import { ApiResponse } from "../ApiModels";
import { ApiClient } from "../axios_setup";

export namespace DispatchApi {
    export namespace Enums {
        export enum DispatchCategories {
            General = 0,
            Asset = 1,
            Agent = 2,
            Operation = 3,
        }
        export enum ActionTypes {
            Create = 0,
            Update = 1,
            Delete = 2,
            ListAll = 3,
            Detail = 4,
        }
    }

    export namespace ListAll {
        export const path = "/dispatches";
        export interface Request {
            searchValue: string;
            relatedEntityId: string;
        }
        export interface Response {
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
            lastActionType: Enums.ActionTypes;
        }
        export const call = async (request: Request): Promise<ApiResponse<Response[]>> => {
            const response = await ApiClient.get(path, {
                params: {
                    search: request.searchValue,
                    relatedEntityId: request.relatedEntityId
                }
            });
            return response.data;
        }
    }

    export namespace Create {
        export const path = "/dispatches";
        export interface Request {
            title: string;
            description: string;
            category: Enums.DispatchCategories;
            occuredAt: string;
            relatedEntityId: string;
            relatedChildEntityId: string | null;
            providerAgentId: string;
        }
        export interface Response {
            id: string;
            title: string;
            description: string;
            category: Enums.DispatchCategories;
            occuredAt: string;
            relatedEntityId: string;
            relatedChildEntityId: string | null;
            providerAgentId: string;
            createdAt: string;
            updatedAt: string | null;
        }
        export const call = async (request: Request): Promise<ApiResponse<Response>> => {
            const response = await ApiClient.post(path, request);
            return response.data;
        }
    }

    export namespace Update {
        export const path = "/dispatches";
        export interface Request {
            id: string;
            title: string;
            description: string;
            category: Enums.DispatchCategories;
            occuredAt: string;
            relatedEntityId: string;
            relatedChildEntityId: string | null;
            providerAgentId: string;
        }
        export interface Response {
            id: string;
            title: string;
            description: string;
            category: Enums.DispatchCategories;
            occuredAt: string;
            relatedEntityId: string;
            relatedChildEntityId: string | null;
            providerAgentId: string;
            createdAt: string;
            updatedAt: string | null;
        }
        export const call = async (request: Request): Promise<ApiResponse<Response>> => {
            const { id, ...body } = request;
            const response = await ApiClient.put(`${path}/${id}`, body);
            return response.data;
        }
    }

    export namespace Delete {
        export const path = "/dispatches";
        export interface Request {
            id: string;
        }
        export interface Response {
            id: string;
            title: string;
            description: string;
            category: Enums.DispatchCategories;
            occuredAt: string;
            relatedEntityId: string;
            relatedChildEntityId: string | null;
            providerAgentId: string;
            createdAt: string;
            updatedAt: string | null;
        }
        export const call = async (request: Request): Promise<ApiResponse<Response>> => {
            const response = await ApiClient.delete(`${path}/${request.id}`);
            return response.data;
        }
    }
}
