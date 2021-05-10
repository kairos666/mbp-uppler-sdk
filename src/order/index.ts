import { Base } from '../base';
import { parseResponseHeadersMeta, queryParamsStringifier } from '../utils';
import { SearchOrdersParams, OrdersExpandingKeys } from './types';

const resourceName = 'orders';
export class Order extends Base {
    getOrders(params:SearchOrdersParams) {
        // response code 200 = all results, code 206 = single page in multi pages results
        return this.requestHandler({
            method: 'get',
            url: `/v1/administrator/order/${ queryParamsStringifier(params) }`
        })
    }

    async getAllOrders(params:SearchOrdersParams) {
        //1. get first page with maxItemsPerPage
        const firstQueryReq = await this.getOrders({ ...params, perPage: 10/*this.config.maxItemsPerPage*/, page: 1 });

        //2. evaluate if more pages are available for this resource (response headers indicate how many results possible)
        const metaResourcesInfo = parseResponseHeadersMeta(firstQueryReq.headers);
        const totalResourcePages = Math.ceil(metaResourcesInfo.totalResourceCount / 10/*metaResourcesInfo.maxPerPageCount*/);

        //3. if no more pages return results, if more pages call all missing pages in parralel
        if(totalResourcePages === 1) return firstQueryReq;
        const missingPageIndexes = [...Array(totalResourcePages + 1).keys()].slice(2);
        this.logger.info(`Need to extract ${ totalResourcePages -1 } more pages`);
        this.logger.log(missingPageIndexes);
        //4. once all results arrived merged response array and reply
    }

    getOrderById(params:{ id:number, expanding?: Array<OrdersExpandingKeys> }) {
        const clonedParams = { ...params };
        delete (clonedParams as any).id;
        
        return this.requestHandler({
            method: 'get',
            url: `/v1/administrator/order/${ params.id }${ queryParamsStringifier(params) }`
        });
    }
}