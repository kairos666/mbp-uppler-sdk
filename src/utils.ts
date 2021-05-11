import { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { ILogger } from "./interfaces";
import { ReqHandlerFunc, SDKConfig } from "./types";

export function applyMixins(derivedCtor: any, baseCtors: any[]) {
    baseCtors.forEach(baseCtor => {
        Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
            Object.defineProperty(
                derivedCtor.prototype,
                name,
                (Object.getOwnPropertyDescriptor(baseCtor.prototype, name) as any)
            );
        });
    });
}

function sortingQueryBuiler(sortingParams:Array<[string, string]>):string[] {
    return sortingParams.map(sortingKey => `sorting[${ sortingKey[0] }]=${ sortingKey[1] }`);
}

function filteringQueryBuiler(filteringParams:Array<[string, string[]]>):string[] {
    return filteringParams.map(filteringKey => {
        const isMonoFilter = filteringKey[1].length === 1;
        return isMonoFilter
            ? [`criteria[${ filteringKey[0] }]=${ filteringKey[1] }`]
            : filteringKey[1].map(filterValue => `criteria[${ filteringKey[0] }][]=${ filterValue }`)
    }).reduce((flattened, arr) => flattened.concat(arr), []);
}

function expandingQueryBuiler(expandingParams:string[]):string[] {
    return expandingParams.map(expandKey => `expand[${ expandKey }]=${ expandKey }`);
}

export function queryParamsStringifier(params:any):string {
    // Uppler params custom stringifier
    const paramsPreQueryString:string[] = Object.keys(params)
        .map(key => {
            // pre format property value pairs depending on use case
            switch(true) {
                case key === 'sorting': return sortingQueryBuiler(params[key]);
                case key === 'filtering': return filteringQueryBuiler(params[key]);
                case key === 'expanding': return expandingQueryBuiler(params[key]);

                default: return [`${ key }=${ params[key] }`];
            }
        })
        .reduce((flattened, arr) => flattened.concat(arr), []);

    // concat and stringify query string
    return `?${ paramsPreQueryString.join('&') }`;
}

/**
 * make a request handler retryable N times with possible side effect on fail
 * @param requestConfig request params
 * @param requestHandler request handler (axios based)
 * @param failureSideEffectBeforeRetry side effect on failure, abort retries if returns true
 * @param retryCount retry count (default 1)
 */
export async function retryRequestWrapper(requestConfig:AxiosRequestConfig, requestHandler:(requestConfig:AxiosRequestConfig) => Promise<AxiosResponse>, failureSideEffectBeforeRetry?:(error:AxiosError) => boolean, retryCount:number = 1):Promise<AxiosResponse> {
    for (let i = 0; i <= retryCount; i++) {
        try {
            return await requestHandler(requestConfig);
        } catch (error) {
            if(i === retryCount) {
                // failed at last attempt, should throw
                throw error;
            } else {
                // failed but can still retry, execute failure side effect if it exists
                if(!failureSideEffectBeforeRetry) continue;
                
                // failure side effect execution and eventual retry abortion
                const isRetryAborted = failureSideEffectBeforeRetry(error);
                if(isRetryAborted) throw error;
            }
        }
    }
}

/**
 * extract useful information from response headers
 * @param respHeaders 
 */
export function parseResponseHeadersMeta(respHeaders:any):any {
    const results:any = {};

    Object.keys(respHeaders).forEach(headerKey => {
        switch(headerKey) {
            case 'accept-range': 
                const splitValue = respHeaders[headerKey].split(' ');
                results.resource = splitValue[0];
                results.maxPerPageCount = parseInt(splitValue[1]);
            break;

            case 'content-range':
                const splitAValue = respHeaders[headerKey].split('/');
                const splitBValue = splitAValue[0].split('-');
                results.firstResourceNb = parseInt(splitBValue[0]);
                results.lastResourceNb = parseInt(splitBValue[1]);
                results.totalResourceCount = parseInt(splitAValue[1]);
            break;
        }
    });

    return results;
}

/**
 * a helper wrapper function that handle paginated resources to extract the full list
 * @param getResourceHandler 
 * @param config 
 * @param logger 
 * @returns Promise<AxiosResponse>
 */
export function getAllResourcesFrom<P>(getResourceHandler:ReqHandlerFunc<P>, config:SDKConfig, logger:ILogger):ReqHandlerFunc<P>  {
    return async (params) => {
        //1. get first page with maxItemsPerPage
        const firstQueryReq = await getResourceHandler({ ...params, perPage: config.maxItemsPerPage, page: 1 });

        //2. evaluate if more pages are available for this resource (response headers indicate how many results possible)
        const metaResourcesInfo = parseResponseHeadersMeta(firstQueryReq.headers);
        const totalResourcePages = Math.ceil(metaResourcesInfo.totalResourceCount / config.maxItemsPerPage);
        if(metaResourcesInfo.maxPerPageCount !== config.maxItemsPerPage) logger.warn(`${ metaResourcesInfo.resource } resource has a maxPerPageCount of ${ metaResourcesInfo.maxPerPageCount } (config is ${ config.maxItemsPerPage })`);

        //3. if no more pages return results, if more pages call all missing pages in parralel
        if(totalResourcePages <= 1) return firstQueryReq;
        const missingPageIndexes = [...Array(totalResourcePages + 1).keys()].slice(2);
        logger.info(`Need to extract ${ totalResourcePages - 1 } more pages`);
        
        //4. once all results arrived merged response array and reply
        const otherQueryReqs = await Promise.all(missingPageIndexes.map(pageIndex => getResourceHandler({ ...params, perPage: config.maxItemsPerPage, page: pageIndex })));
        const concatenatedResponses = otherQueryReqs.map(resp => resp.data);
        
        const allOrders = [...firstQueryReq.data, ...[].concat(...concatenatedResponses)];
        firstQueryReq.data = allOrders;

        return firstQueryReq;
    }
}