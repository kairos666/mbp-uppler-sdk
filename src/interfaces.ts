import { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { SDKConfig } from "./types";

export interface ILogger {
    toggleActivation:(isActive:boolean) => void,
    log:(...args:any[]) => void,
    info:(...args:any[]) => void,
    warn:(...args:any[]) => void,
    request:(url:string, isTokenReq?:boolean) => void,
    response:(response:AxiosResponse) => void,
    serverError:(error:AxiosError) => void,
    networkError:(error:AxiosError) => void,
    genericError:(error:AxiosError) => void
}

export interface IRequestHandler {
    init: (config:SDKConfig) => void
    requestHandler: (requestConfig:AxiosRequestConfig) => Promise<AxiosResponse>
}