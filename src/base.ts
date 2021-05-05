import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

type SDKConfig = {
    clientID: string,
    clientSecret: string,
    baseURL: string,
    basicAuth?: { username:string, password:string }
}

export type Pagination = {
    page?: number,
    perPage?: number,
}

export type SortingDirections = 'asc'|'desc';

export abstract class Base {
    private clientID: string;
    private clientSecret: string;
    private basicAuth: { username:string, password:string } | undefined;
    private baseURL: string;
    private axios:AxiosInstance;

    constructor(config:SDKConfig) {
        this.clientID = config.clientID;
        this.clientSecret = config.clientSecret;
        this.basicAuth = config.basicAuth;
        this.baseURL = config.baseURL;

        // generate axios instance with base config
        this.axios = axios.create({ 
            baseURL: this.baseURL, 
            headers: { 'Content-type': 'application/json' }
        });
    }
    
    protected requestHandler(requestConfig:AxiosRequestConfig):Promise<any> {
        const baseRequestConfig:AxiosRequestConfig = {};

        // adds basic auth if necessary (Uppler PRP requires it for the moment)
        if(this.isBasicAuthEnabled) baseRequestConfig.auth = this.basicAuth;

        return this.axios.request({...baseRequestConfig, ...requestConfig});
    }

    protected tokenRequestHandler(requestConfig:AxiosRequestConfig):Promise<any> {
        const baseRequestConfig:AxiosRequestConfig = {
            data: {
                client_id: this.clientID,
                client_secret: this.clientSecret,
                grant_type: 'client_credentials'
            },
            headers: { "Content-Type": 'application/x-www-form-urlencoded' }
        };

        // adds basic auth if necessary (Uppler PRP requires it for the moment)
        if(this.isBasicAuthEnabled) baseRequestConfig.auth = this.basicAuth;
        
        return this.axios.request({...baseRequestConfig, ...requestConfig});
    }

    protected get isBasicAuthEnabled():boolean {
        return !!this.basicAuth;
    }
}