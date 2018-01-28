export interface StatusResponse {
    Status: string;
}

export interface ApiResult<T> {
    Status: string;
    Data: T;
}
