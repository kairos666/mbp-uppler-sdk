import { Base } from '../base';
import { getAllResourcesFrom, queryParamsStringifier } from '../utils';
import { SearchBuyersParams, BuyersExpandingKeys, SearchSellersParams, SellersExpandingKeys } from './types';
export class Company extends Base {
    /* BUYERS */
    async getBuyers(params:SearchBuyersParams) {
        // response code 200 = all results, code 206 = single page in multi pages results
        return this.requestHandler({
            method: 'get',
            url: `/v1/administrator/buyer/${ queryParamsStringifier(params) }`
        })
    }

    async getAllBuyers(params:SearchBuyersParams) {
        return getAllResourcesFrom(this.getBuyers.bind(this), this.config, this.logger)(params);
    }

    async getBuyerById(params:{ id:number, expanding?: Array<BuyersExpandingKeys> }) {
        const clonedParams = { ...params };
        delete (clonedParams as any).id;
        
        return this.requestHandler({
            method: 'get',
            url: `/v1/administrator/buyer/${ params.id }${ queryParamsStringifier(params) }`
        });
    }

    /* SELLERS */
    async getSellers(params:SearchSellersParams) {
        // response code 200 = all results, code 206 = single page in multi pages results
        return this.requestHandler({
            method: 'get',
            url: `/v1/administrator/seller/${ queryParamsStringifier(params) }`
        })
    }

    async getAllSellers(params:SearchSellersParams) {
        return getAllResourcesFrom(this.getSellers.bind(this), this.config, this.logger)(params);
    }

    async getSellerById(params:{ id:number, expanding?: Array<SellersExpandingKeys> }) {
        const clonedParams = { ...params };
        delete (clonedParams as any).id;
        
        return this.requestHandler({
            method: 'get',
            url: `/v1/administrator/seller/${ params.id }${ queryParamsStringifier(params) }`
        });
    }
}