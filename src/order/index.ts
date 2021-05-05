import { Base } from '../base';
import { queryParamsStringifier } from '../utils';
import { SearchOrdersParams, OrdersExpandingKeys } from './types';

const resourceName = 'orders';
export class Order extends Base {
    getOrders(params:SearchOrdersParams) {
        // response code 200 = all results, code 206 = single page results
        return queryParamsStringifier(params);
    }

    getOrderById(params:{ id:number, expanding?: Array<keyof OrdersExpandingKeys> }) {
        // TODO WIP rework params merge
        const clonedParams = { ...params };
        delete (clonedParams as any).id;
        
        return this.requestHandler({
            method: 'get',
            url: `/v1/administrator/order/${ params.id }${ queryParamsStringifier(params) }`
        });
    }
}