import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { ILogger } from "./Logger";

type SDKConfig = {
    clientID: string,
    clientSecret: string,
    baseURL: string,
    basicAuth: { username:string, password:string }
}

export default class UpplerRequestHandlerPRP {
    private token:string = null;
    private config:SDKConfig = null;
    private axiosInstance:AxiosInstance = null;
    private logger:ILogger;

    constructor(logger:ILogger) {
        this.logger = logger;
    }

    init(config:SDKConfig) {
        console.log('UpplerRequestHandlerPRP service initiated');
        this.config = config;

        // generate axios instance with base config
        this.axiosInstance = axios.create({ 
            baseURL: this.config.baseURL, 
            headers: { 'Content-type': 'application/json' }
        });
    }

    public async requestHandler(requestConfig:AxiosRequestConfig):Promise<AxiosResponse> {
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
                this.token = resp.data.access_token;

                // log response
                this.logger.response(resp)

                return this.token;
            });
    }
}