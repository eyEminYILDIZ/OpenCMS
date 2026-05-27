export namespace AssetApi {
    export namespace GetItemCounts {
        export const path = "/Assets/counts";
        export interface Response {
            activeCount: number;
            inactiveCount: number;
        }
    }
}