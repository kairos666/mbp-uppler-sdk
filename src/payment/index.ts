import { Base } from '../base';
import { getAllResourcesFrom, queryParamsStringifier } from '../utils';
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
        return getAllResourcesFrom(this.getPayments.bind(this), this.config, this.logger)(params);
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