import { Base } from '../base';

const resourceName = 'orders';

export class Order extends Base {
    getOrders(params?:any) {
        return ['some', 'orders'];
    }

    getOrderById(params?:any) {
        return 'order';
    }
}