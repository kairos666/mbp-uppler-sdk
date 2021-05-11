import { Base } from '../base';
import { parseResponseHeadersMeta, queryParamsStringifier } from '../utils';
import { SearchPaymentsParams } from './types';

export class Payment extends Base {
    async getPayments(params:SearchPaymentsParams) {
        // response code 200 = all results, code 206 = single page in multi pages results
        return this.requestHandler({
            method: 'get',
            url: `/v1/administrator/payment/${ queryParamsStringifier(params) }`
        })
    }

    async getAllPayments(params:SearchPaymentsParams) {
        //1. get first page with maxItemsPerPage
        const firstQueryReq = await this.getPayments({ ...params, perPage: this.config.maxItemsPerPage, page: 1 });

        //2. evaluate if more pages are available for this resource (response headers indicate how many results possible)
        const metaResourcesInfo = parseResponseHeadersMeta(firstQueryReq.headers);
        const totalResourcePages = Math.ceil(metaResourcesInfo.totalResourceCount / this.config.maxItemsPerPage);
        if(metaResourcesInfo.maxPerPageCount !== this.config.maxItemsPerPage) this.logger.warn(`${ metaResourcesInfo.resource } resource has a maxPerPageCount of ${ metaResourcesInfo.maxPerPageCount } (config is ${ this.config.maxItemsPerPage })`);

        //3. if no more pages return results, if more pages call all missing pages in parralel
        if(totalResourcePages === 1) return firstQueryReq;
        const missingPageIndexes = [...Array(totalResourcePages + 1).keys()].slice(2);
        this.logger.info(`Need to extract ${ totalResourcePages - 1 } more pages`);
        
        //4. once all results arrived merged response array and reply
        const otherQueryReqs = await Promise.all(missingPageIndexes.map(pageIndex => this.getPayments({ ...params, perPage: this.config.maxItemsPerPage, page: pageIndex })));
        const concatenatedResponses = otherQueryReqs.map(resp => resp.data);
        
        const allOrders = [...firstQueryReq.data, ...[].concat(...concatenatedResponses)];
        firstQueryReq.data = allOrders;

        return firstQueryReq;
    }

    async getPaymentById(params:{ id:number }) {
        const clonedParams = { ...params };
        delete (clonedParams as any).id;
        
        return this.requestHandler({
            method: 'get',
            url: `/v1/administrator/payment/${ params.id }`
        });
    }
}