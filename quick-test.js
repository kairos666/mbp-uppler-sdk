const UpplerSDK = require('./dist/index').default;

const upplerSDK = new UpplerSDK({ 
    baseURL: '<BASE_API_URL>',
    clientID: '<CLIENT_ID>',
    clientSecret: '<CLIENT_SECRET>',
    basicAuth: { username: '<BASIC_AUTH_USER>', password: '<BASIC_AUTH_PWD>' }
});

console.table(upplerSDK.getOrders({ 
    perPage: 50,
    page: 2,
    sorting: [
        ['state', 'asc'],
        ['buyer', 'desc'],
    ], 
    filtering: [
        ['type', ['order', 'pre-order', 'quote']],
        ['state', ['accepted']],
        ['buyer', ['121', '7', '12']],
    ], 
    expanding: ['buyer', 'seller', 'items'] 
}));

upplerSDK.getOrderById({ id: 1348, expanding: ['buyer', 'seller'] })
    .then(resp => console.log(resp.data))
    .catch(err => console.log(err));