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
    }
    export namespace ListAll {
        export const path = "/dispatches";
        export interface Response {
            id: string;
            title: string;
            description: string;
            category: Enums.DispatchCategories;
            occuredAt: string;
            relatedEntityId: string;
            relatedChildEntityId: string | null;
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
    export namespace ListFiltered {
        export const path = "/dispatches/filtered";
        export interface Request {
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
            createdAt: string;
            updatedAt: string | null;
        }
        export const call = async (request: Request): Promise<ApiResponse<Response[]>> => {
            const response = await ApiClient.get(path, {
                params: {
                    relatedEntityId: request.relatedEntityId
                }
            });
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
            createdAt: string;
            updatedAt: string | null;
        }
        export const call = async (request: Request): Promise<ApiResponse<Response>> => {
            const response = await ApiClient.delete(`${path}/${request.id}`);
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
        }
        export interface Response {
            id: string;
            title: string;
            description: string;
            category: Enums.DispatchCategories;
            occuredAt: string;
            relatedEntityId: string;
            relatedChildEntityId: string | null;
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
        }
        export interface Response {
            id: string;
            title: string;
            description: string;
            category: Enums.DispatchCategories;
            occuredAt: string;
            relatedEntityId: string;
            relatedChildEntityId: string | null;
            createdAt: string;
            updatedAt: string | null;
        }
        export const call = async (request: Request): Promise<ApiResponse<Response>> => {
            const response = await ApiClient.put(`${path}/${request.id}`, request);
            return response.data;
        }
    }
}
