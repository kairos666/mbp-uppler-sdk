import { Base } from '../base';
import { getAllResourcesFrom, queryParamsStringifier } from '../utils';
import { SearchSubscriptionsParams, SubscriptionsExpandingKeys } from './types';
export class Subscription extends Base {
    async getSubscriptions(params:SearchSubscriptionsParams) {
        // response code 200 = all results, code 206 = single page in multi pages results
        return this.requestHandler({
            method: 'get',
            url: `/v1/administrator/subscription/${ queryParamsStringifier(params) }`
        })
    }

    async getAllSubscriptions(params:SearchSubscriptionsParams) {
        return getAllResourcesFrom(this.getSubscriptions.bind(this), this.config, this.logger)(params);
    }

    async getSubscriptionById(params:{ id:number, expanding?: Array<SubscriptionsExpandingKeys> }) {
        const clonedParams = { ...params };
        delete (clonedParams as any).id;
        
        return this.requestHandler({
            method: 'get',
            url: `/v1/administrator/subscription/${ params.id }${ queryParamsStringifier(params) }`
        });
    }
}