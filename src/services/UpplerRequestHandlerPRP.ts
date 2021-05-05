import axios, { AxiosInstance, AxiosRequestConfig } from "axios";

type SDKConfig = {
    clientID: string,
    clientSecret: string,
    baseURL: string,
    basicAuth: { username:string, password:string }
}

export default class UpplerRequestHandlerPRP {
    private config:SDKConfig = null;
    private axiosInstance:AxiosInstance = null;

    init(config:SDKConfig) {
        console.log('UpplerRequestHandlerPRP service instanciated');
        this.config = config;

        // generate axios instance with base config
        this.axiosInstance = axios.create({ 
            baseURL: this.config.baseURL, 
            headers: { 'Content-type': 'application/json' }
        });
    }

    public async requestHandler(requestConfig:AxiosRequestConfig):Promise<any> {
        // TODO WIP dynamic token
        const token = await this.getToken();
        const baseRequestConfig:AxiosRequestConfig = {
            params: { access_token: token },
            auth: this.config.basicAuth
        };

        return this.axiosInstance.request({...baseRequestConfig, ...requestConfig});
    }

    private async getToken():Promise<string> {
        const axiosBaseRequestConfigForTokenGeneration = {
            data: {
                client_id: this.config.clientID,
                client_secret: this.config.clientSecret,
                grant_type: 'client_credentials'
            },
            headers: { "Content-Type": 'application/x-www-form-urlencoded' }
        }
        return 'ODZmNTM3ZGVhOGViOGQ0YzliNDA2MzBiYWVmYjU3YWQyNDRjOTNlYmFlNjY2MDA3YzE1MjdlNjhmY2ZkMzY2OQ';
    }
}