import { AxiosError, AxiosRequestConfig } from 'axios';
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

    private errorHandler(error:AxiosError) {
        switch(true) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            case !!error.response:
                console.log('server response error');
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
            break;

            // The request was made but no response was received
            // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
            // http.ClientRequest in node.js
            case !!error.request:
                console.log('server unresponsive error');
                console.log(error.request);
            break;

            // Something happened in setting up the request that triggered an Error
            default:
                console.log('unknown ajax error', error.message);
        }
    }
    
    protected requestHandler(requestConfig:AxiosRequestConfig):Promise<any> {
        const returnedPromise = this.requestHandlerService.requestHandler(requestConfig);

        // intercept errors
        returnedPromise.catch(this.errorHandler);
        
        return returnedPromise;
    }
}