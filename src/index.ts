import { Order } from './order';
import { Payment } from './payment';
import { Company } from './company';
import { Subscription } from './subscription';
import { applyMixins } from './utils';
import { Base } from './base';

class UpplerSDK extends Base {}
interface UpplerSDK extends Order, Payment, Company, Subscription {}
applyMixins(UpplerSDK, [Order, Payment, Company, Subscription]);

export default UpplerSDK