import { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { bottle } from './services/bottle';
import { ILogger } from './services/Logger';

// config type that match both request handlers
type SDKConfig = {
    clientID: string,
    clientSecret: string,
    baseURL: string,
    basicAuth?: { username:string, password:string }
    debug?: boolean
}

export type Pagination = {
    page?: number,
    perPage?: number,
}

export type SortingDirections = 'asc'|'desc';

export abstract class Base {
    private requestHandlerService:any;
    private logger:ILogger;

    constructor(config:SDKConfig) {
        // choose which request handler to choose (PRP requires basic auth in addition to client credentials grant)
        this.requestHandlerService = (config.basicAuth)
            ? bottle.container.reqHandlerPRP
            : bottle.container.reqHandlerPROD;

        // setup logger
        this.logger = bottle.container.logger;
        this.logger.toggleActivation(!!config.debug);

        // init request handler
        this.requestHandlerService.init(config);
    }
    
    protected requestHandler(requestConfig:AxiosRequestConfig):Promise<AxiosResponse> {
        // REQUEST logger
        this.logger.request(requestConfig.url);
        const returnedPromise = this.requestHandlerService.requestHandler(requestConfig);

        // intercept errors and log response
        returnedPromise
            .then((resp:AxiosResponse) => this.logger.response(resp))
            .catch(this.errorHandler);
        
        return returnedPromise;
    }

    private errorHandler(error:AxiosError) {
        switch(true) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            case !!error.response:
                this.logger.serverError(error);
            break;

            // The request was made but no response was received
            // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
            // http.ClientRequest in node.js
            case !!error.request:
                this.logger.networkError(error);
            break;

            // Something happened in setting up the request that triggered an Error
            default:
                this.logger.genericError(error);
        }
    }

    public set debug(isDebug:boolean) {
        this.logger.toggleActivation(isDebug);
    }
}