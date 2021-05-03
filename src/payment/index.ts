import { Base } from '../base';

const resourceName = 'payments';

export class Payment extends Base {
    getPayments(params?:any) {
        return ['some', 'orders'];
    }

    getPaymentById(params?:any) {
        return 'order';
    }
}