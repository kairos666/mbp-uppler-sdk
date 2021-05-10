import { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { bottle } from './services/bottle';
import { ILogger, IRequestHandler } from './interfaces';
import { SDKConfig } from './types';
export abstract class Base {
    private requestHandlerService:IRequestHandler;
    protected logger:ILogger;
    protected readonly config:SDKConfig;

    constructor(config:SDKConfig) {
        this.config = config;
        // choose which request handler to choose (PRP requires basic auth in addition to client credentials grant)
        this.requestHandlerService = (this.config.basicAuth)
            ? bottle.container.reqHandlerPRP
            : bottle.container.reqHandlerPROD;

        // setup logger
        this.logger = bottle.container.logger;
        this.logger.toggleActivation(!!this.config.debug);

        // init request handler
        this.requestHandlerService.init(this.config);
    }
    
    protected requestHandler(requestConfig:AxiosRequestConfig):Promise<AxiosResponse> {
        // REQUEST logger
        this.logger.request(requestConfig.url);
        const returnedPromise = this.requestHandlerService.requestHandler(requestConfig);

        // intercept errors and log response
        returnedPromise
            .then((resp:AxiosResponse) => this.logger.response(resp))
            .catch(this.errorHandler.bind(this));
        
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