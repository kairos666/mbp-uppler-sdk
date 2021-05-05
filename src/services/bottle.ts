import Bottle from 'bottlejs';
import RequestHandlerPROD from './UpplerRequestHandlerPROD';
import RequestHandlerPRP from './UpplerRequestHandlerPRP';

const bottleInstance = new Bottle();
bottleInstance.service('reqHandlerPROD', RequestHandlerPROD);
bottleInstance.service('reqHandlerPRP', RequestHandlerPRP);

export const bottle = bottleInstance;
