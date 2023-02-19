import { AxiosRequestConfig } from "axios";
import { FetchOptions } from "./scraping.interfaces";


export function toAxiosConfig(input: FetchOptions<any>): AxiosRequestConfig {
    return {
        url: input.url,
        params: input.query,
        method: input.method,
        headers: input.headers,
        data: input.body,
    };
}