import { ApiResponse } from "../ApiModels";
import { ApiClient } from "../axios_setup";

export namespace AssetApi {
    export namespace Enums {
        export enum AssetTypes {
            Unknown = 0,
            Person = 1,
            GroupOfPeople = 2,
            Aircraft = 3,
            Ship = 4,
            Submarine = 5,
            Vehicle = 6,
            Building = 7,
            Other = 8,
        }
        export enum ThreatTypes {
            Unknown = 0,
            Own = 1,
            Friend = 2,
            Neutral = 3,
            Hostile = 4,
        }
    }
    export namespace ListAll {
        export const path = "/assets";
        export interface Response {
            id: string;
            name: string;
            latitude: number;
            longitude: number;
            altitude: number;
            heading: number;
            speed: number;
            assetType: Enums.AssetTypes;
            threatType: Enums.ThreatTypes;
            isActive: boolean;
            firstUpdated: string;
            lastUpdated: string;
            relatedAgentId: string | null;
            createdAt: string;
            updatedAt: string | null;
        }
        export const call = async (): Promise<ApiResponse<Response[]>> => {
            const response = await ApiClient.get(path);
            return response.data;
        }
    }
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