import { AxiosError, AxiosResponse } from "axios";
import chalk from 'chalk';
import { ILogger } from "../interfaces";

export default class Logger implements ILogger {
    private isActive = false;
    private expandResponses = false;

    /**
     * toggle on/off SDK logger
     * @param isActive 
     */
    public toggleActivation(debugLevel:0|1|2) {
        this.isActive = (debugLevel >= 1);
        this.expandResponses = (debugLevel >= 2);
    }

    // LOGS
    public log(...args:any[]) {
        if(!this.isActive) return;
        console.log(...args);
    }

    public info(...args:any[]) {
        if(!this.isActive) return;
        console.log(chalk.bgBlue(' INFO '), ...args);
    }

    public warn(...args:any[]) {
        if(!this.isActive) return;
        console.log(chalk.yellow(' WARNING '), ...args);
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
        console.log(chalk.green.inverse(' RESPONSE '), chalk.green(response?.status));
        if(this.expandResponses) console.log(response?.data);
    }

    // ERRORS
    public serverError(error:AxiosError) {
        if(!this.isActive) return;
        console.log(`${ chalk.bgRed(' ERROR ') } ${ chalk.red(error?.response?.status) } ${ chalk.red(' - server response error') }`);
        console.log(error?.response?.headers);
        console.log(error?.response?.data);
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