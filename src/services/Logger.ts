import { AxiosError, AxiosResponse } from "axios";
import chalk from 'chalk';

export interface ILogger {
    toggleActivation:(isActive:boolean) => void,
    request:(url:string, isTokenReq?:boolean) => void,
    response:(response:AxiosResponse) => void,
    serverError:(error:AxiosError) => void,
    networkError:(error:AxiosError) => void,
    genericError:(error:AxiosError) => void
}

export default class Logger {
    private isActive = false;

    /**
     * toggle on/off SDK logger
     * @param isActive 
     */
    public toggleActivation(isActive:boolean) {
        this.isActive = isActive;
    }

    // TRAFFIC
    public request(url:string, isTokenReq:boolean = false) {
        switch(true) {
            case !this.isActive: return;
            case isTokenReq: console.log(chalk.cyan(`TOKEN REQUEST - ${ url }`)); break;
            default:
                console.log(chalk.blue(`REQUEST - ${ url }`));
        }
    }

    public response(response:AxiosResponse) {
        if(!this.isActive) return;
        console.log(chalk.green.inverse(' RESPONSE '));
        console.log(response.data);
    }

    // ERRORS
    public serverError(error:AxiosError) {
        if(!this.isActive) return;
        console.log(`${ chalk.bgRed(' ERROR ') }${ chalk.red(' - server response error') }`);
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
    }

    public networkError(error:AxiosError) {
        if(!this.isActive) return;
        console.log(`${ chalk.bgRed(' ERROR ') }${ chalk.red(' - server unresponsive error') }`);
        console.log(error.request);
    }

    public genericError(error:AxiosError) {
        if(!this.isActive) return;
        console.log(`${ chalk.bgRedBright(' ERROR ') }${ chalk.redBright(' - generic SDK error') }`);
        console.log(error.message);
    }
} 