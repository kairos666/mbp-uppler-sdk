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
        const fullParams = {
            access_token: 'NTRmNmI2M2VkZWQyZjE0YzFiMmRjYzUxZDgyMjJmMTg4NGZmMWM1NmExZTJhM2ZmMmQ3YmQ5OTg3Yjc3YzYwZQ',
            ...params
        };
        delete (fullParams as any).id;

        return this.requestHandler({
            method: 'get',
            url: `/v1/administrator/order/${ params.id }`,
            params: queryParamsStringifier(fullParams)
        });
    }
}