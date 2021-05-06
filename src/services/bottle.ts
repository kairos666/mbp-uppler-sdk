import Bottle from 'bottlejs';
import Logger from './Logger';
import RequestHandlerPROD from './UpplerRequestHandlerPROD';
import RequestHandlerPRP from './UpplerRequestHandlerPRP';

const bottleInstance = new Bottle();
bottleInstance.service('logger', Logger);
bottleInstance.service('reqHandlerPROD', RequestHandlerPROD, 'logger');
bottleInstance.service('reqHandlerPRP', RequestHandlerPRP, 'logger');

export const bottle = bottleInstance;
