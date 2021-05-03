import axios, { AxiosInstance, AxiosPromise, AxiosRequestConfig } from 'axios';

type Config = {
    apiKey: string,
    baseURL: string
}

export type Pagination = {
    page?: number,
    per_page?: number,
}

export abstract class Base {
    private apiKey: string;
    private baseURL: string;
    private axiosInstance:AxiosInstance;

    constructor(config:Config) {
        this.apiKey = config.apiKey;
        this.baseURL = config.baseURL;
        this.axiosInstance = axios.create({ 
            baseURL: this.baseURL, 
            headers: {
                'api-key': this.apiKey,
                'Content-type': 'application/json'
            } 
        });
    }
    
    protected request<T> (endpoint:string, options?:AxiosRequestConfig): AxiosPromise<T> {
        return this.axiosInstance(endpoint, options);
    }
}