import { ApiResult, StatusResponse } from "./response";

export interface TournamentPrizeStructure {
    MaxPlayer: number;
    PrizeLevel: number[];
}
export interface TournamentBetStructure {
    Level: number;
    SmallBlind: number;
    BigBlind: number;
    Ante: number;
}

export interface BannerData {
    /**
     * Id of the banner
     */
    Id: number;

    /**
     * Text representation of the banner
     */
    Title: string;

    /**
     * URL which could be used to retrieve banner.
     */
    Url: string;

    /**
     * URL which could be used to navigate when click on the banner.
     */
    Link: string;
}

/**
 * Response for the VersionCheck API call
 */
export interface VersionCheckResponse {
    /**
     * Current version of server API.
     */
    ServerApiVersion: number;
    /**
     * Minimum compatible version of client API.
     */
    MinimumClientApiVersion: number;
}

export interface AvatarsResponse extends StatusResponse {
    Avatars: string[];
}

export interface IInformation {
    getWellKnownBetStructure(): Promise<ApiResult<TournamentBetStructure[][]>>;
    getWellKnownPrizeStructure(): Promise<ApiResult<TournamentPrizeStructure[][]>>;
    getOnlinePlayers(): Promise<ApiResult<number[]>>;
    /**
     * Request server date.
     */
    getDate(): Promise<number>;
    /**
     * Perform version check.
     */
    getVersion(): Promise<VersionCheckResponse>;
    getServerLayout(): Promise<AvatarsResponse>;
    getDefaultAvatars(): Promise<AvatarsResponse>;
    getNews(): Promise<ApiResult<string[]>>;
    getBanners(format: number): Promise<ApiResult<BannerData[]>>;
}

export class Information implements IInformation {
    /**
     * Access to Information API endpoint.
     * @param host Host where Information endpoint located
     */
    constructor(public host: string) {
    }
    public async getWellKnownBetStructure() {
        const data = {};
        const response = await fetch(this.host + "/api/information/bet-structure");
        const jsonData = await response.json() as ApiResult<TournamentBetStructure[][]>;
        return jsonData;
    }
    public async getWellKnownPrizeStructure() {
        const data = {};
        const response = await fetch(this.host + "/api/information/prize-structure");
        const jsonData = await response.json() as ApiResult<TournamentPrizeStructure[][]>;
        return jsonData;
    }
    public async getOnlinePlayers() {
        const data = {};
        const response = await fetch(this.host + "/api/information/players/online");
        const jsonData = await response.json() as ApiResult<number[]>;
        return jsonData;
    }
    /**
     * Request server date.
     */
    public async getDate() {
        const data = {};
        const response = await fetch(this.host + "/api/information/date");
        const jsonData = await response.json() as number;
        return jsonData;
    }
    /**
     * Perform version check.
     */
    public async getVersion() {
        const data = {};
        const response = await fetch(this.host + "/api/information/version");
        const jsonData = await response.json() as VersionCheckResponse;
        return jsonData;
    }
    public async getServerLayout() {
        const response = await fetch(this.host + "/api/information/servers");
        const jsonData = await response.json() as AvatarsResponse;
        return jsonData;
    }
    public async getDefaultAvatars(): Promise<AvatarsResponse> {
        const response = await fetch(this.host + "/api/avatars/default");
        const jsonData = await response.json() as AvatarsResponse;
        return jsonData;
    }
    public async getNews(): Promise<ApiResult<string[]>> {
        const response = await fetch(this.host + "/api/news");
        const jsonData = await response.json() as ApiResult<string[]>;
        return jsonData;
    }
    public async getBanners(format: number): Promise<ApiResult<BannerData[]>> {
        const response = await fetch(this.host + `/api/banners/${format}`);
        const jsonData = await response.json() as ApiResult<BannerData[]>;
        return jsonData;
    }
}
