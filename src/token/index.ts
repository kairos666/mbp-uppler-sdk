import { Base } from '../base';

export class Token extends Base {
    getToken() {
        return this.tokenRequestHandler({
            method: 'post',
            url: '/oauth/v2/token'
        })
    }
}