import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { retryRequestWrapper } from "../utils";
import { ILogger, IRequestHandler } from "../interfaces";
import { SDKConfig } from "../types";
export default class UpplerRequestHandlerPRP implements IRequestHandler {
    private token:string = null;
    private config:SDKConfig = null;
    private axiosInstance:AxiosInstance = null;
    private logger:ILogger;

    constructor(logger:ILogger) {
        this.logger = logger;
    }

    public init(config:SDKConfig) {
        // check for basic auth credentials
        if(!config?.basicAuth) throw new Error('UpplerRequestHandlerPRP wrong init config - missing basicAuth credentials');

        this.logger.info('UpplerRequestHandlerPRP service initiated');
        this.config = config;

        // generate axios instance with base config
        this.axiosInstance = axios.create({ 
            baseURL: this.config.baseURL, 
            headers: { 'Content-type': 'application/json' }
        });
    }

    public async requestHandler(requestConfig:AxiosRequestConfig):Promise<AxiosResponse> {
        // base request handler with N retry (handle token expiration), see https://dev.to/ycmjason/javascript-fetch-retry-upon-failure-3p6g
        return retryRequestWrapper(requestConfig, this.baseRequestHandler.bind(this), (error:AxiosError) => {
            // only retry if token expired (401 error code)
            if(error?.response?.status === 401) {
                this.logger.info('token probably expired - retry with new token generation');
                this.token = null;

                return false;
            }

            // abort retries for other error cases
            return true;
        });
    }

    private async baseRequestHandler(requestConfig:AxiosRequestConfig):Promise<AxiosResponse> {
        const token = await this.getToken();
        const baseRequestConfig:AxiosRequestConfig = {
            params: { access_token: token },
            auth: this.config.basicAuth
        };

        return this.axiosInstance.request({...baseRequestConfig, ...requestConfig});
    }

    private async getToken():Promise<string> {
        // leave early if token already exists
        if(this.token) return this.token; 

        // otherwise generate new token and register it
        const axiosBaseRequestConfigForTokenGeneration:AxiosRequestConfig = {
            method: 'post',
            url: '/oauth/v2/token',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            data: {
                client_id: this.config.clientID,
                client_secret: this.config.clientSecret,
                grant_type: 'client_credentials'
            },
            auth: this.config.basicAuth
        }

        // REQUEST logger
        this.logger.request(axiosBaseRequestConfigForTokenGeneration.url, true);
        return this.axiosInstance
            .request(axiosBaseRequestConfigForTokenGeneration)
            .then(resp => {
                // register token for reuse
                this.token = resp?.data?.access_token ?? null;

                // log response
                this.logger.response(resp)

                return this.token;
            });
    }
}