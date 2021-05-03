import { Order } from './order';
import { Payment } from './payment'; 
import { applyMixins } from './utils';
import { Base } from './base';

class UpplerSDK extends Base {}
interface UpplerSDK extends Order, Payment {}
applyMixins(UpplerSDK, [Order, Payment]);

export default UpplerSDK