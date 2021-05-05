import { AxiosRequestConfig } from 'axios';
import { bottle } from './services/bottle';

// config type that match both request handlers
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
    private requestHandlerService:any;

    constructor(config:SDKConfig) {
        // choose which request handler to choose (PRP requires basic auth in addition to client credentials grant)
        this.requestHandlerService = (config.basicAuth)
            ? bottle.container.reqHandlerPRP
            : bottle.container.reqHandlerPROD;

        // init request handler
        this.requestHandlerService.init(config);
    }
    
    protected requestHandler(requestConfig:AxiosRequestConfig):Promise<any> {
        return this.requestHandlerService.requestHandler(requestConfig);
    }
}