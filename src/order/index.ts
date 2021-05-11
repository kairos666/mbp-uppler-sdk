import { Base } from '../base';
import { getAllResourcesFrom, queryParamsStringifier } from '../utils';
import { SearchOrdersParams, OrdersExpandingKeys } from './types';
export class Order extends Base {
    async getOrders(params:SearchOrdersParams) {
        // response code 200 = all results, code 206 = single page in multi pages results
        return this.requestHandler({
            method: 'get',
            url: `/v1/administrator/order/${ queryParamsStringifier(params) }`
        })
    }

    async getAllOrders(params:SearchOrdersParams) {
        return getAllResourcesFrom(this.getOrders.bind(this), this.config, this.logger)(params);
    }

    async getOrderById(params:{ id:number, expanding?: Array<OrdersExpandingKeys> }) {
        const clonedParams = { ...params };
        delete (clonedParams as any).id;
        
        return this.requestHandler({
            method: 'get',
            url: `/v1/administrator/order/${ params.id }${ queryParamsStringifier(params) }`
        });
    }
}