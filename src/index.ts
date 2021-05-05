import { Token } from './token';
import { Order } from './order';
import { Payment } from './payment'; 
import { applyMixins } from './utils';
import { Base } from './base';

class UpplerSDK extends Base {}
interface UpplerSDK extends Token, Order, Payment {}
applyMixins(UpplerSDK, [Token, Order, Payment]);

export default UpplerSDK