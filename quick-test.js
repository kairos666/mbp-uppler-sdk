const UpplerSDK = require('./dist/index').default;

const upplerSDK = new UpplerSDK({ 
    baseURL: '<BASE_API_URL>',
    clientID: '<CLIENT_ID>',
    clientSecret: '<CLIENT_SECRET>',
    basicAuth: { username: '<BASIC_AUTH_USER>', password: '<BASIC_AUTH_PWD>' }
});

// PAYMENT BY ID
upplerSDKPRP.getPaymentById({ id: 4865 })
    .then(resp => console.log('consumer response'))
    .catch(() => console.log('consumer error'));
// PAYMENTS with params
upplerSDKPRP.getPayments({ 
    perPage: 10,
    page: 1,
    sorting: [
        ['number', 'asc'],
    ], 
    filtering: [
        ['date_from', ['2020-04-30']],
        ['date_to', ['2021-04-30']]
    ] 
})
    .then(resp => console.log('consumer response', resp.data.length))
    .catch(() => console.log('consumer error'));
// ALL payments with params
upplerSDKPRP.getAllPayments({ 
    sorting: [
        ['number', 'asc'],
    ], 
    filtering: [
        ['date_from', ['2020-04-30']],
        ['date_to', ['2021-04-30']]
    ] 
})
    .then(resp => console.log('consumer response', resp.data.length))
    .catch(() => console.log('consumer error'));

// precise order filtering
// upplerSDKPRP.getOrders({ 
//     perPage: 50,
//     page: 1,
//     sorting: [
//         ['confirmed_at', 'asc'],
//     ], 
//     filtering: [
//         ['seller', [87]],
//         ['type', ['order']],
//         ['state', ['confirmed']],
//         ['confirmed_from', ['2020-04-30']],
//         ['confirmed_to', ['2021-04-30']],
//         ['payment_state', ['transfered']],
//     ], 
//     expanding: ['buyer', 'seller', 'items'] 
// })
//     .then(resp => console.log('consumer response'))
//     .catch(() => console.log('consumer error'));

// broad order filtering
// upplerSDKPRP.getOrders({ 
//     perPage: 10,
//     page: 1,
//     sorting: [
//         ['confirmed_at', 'asc'],
//     ], 
//     filtering: [
//         ['seller', [87]],
//         ['type', ['order']],
//         ['confirmed_from', ['2020-04-30']],
//         ['confirmed_to', ['2021-04-30']]
//     ]
// })
//     .then(resp => console.log('consumer response'))
//     .catch(() => console.log('consumer error'));

// all resources for query
// upplerSDKPRP.getAllOrders({ 
//     sorting: [
//         ['confirmed_at', 'asc'],
//     ], 
//     filtering: [
//         ['seller', [87]],
//         ['type', ['order']],
//         ['confirmed_from', ['2020-04-30']],
//         ['confirmed_to', ['2021-04-30']]
//     ]
// })
//     .then(resp => console.log('consumer response'))
//     .catch(() => console.log('consumer error'));

// upplerSDKPRP.getOrderById({ id: 1348, expanding: ['buyer', 'seller'] })
//     .then(resp => console.log('consumer response'))
//     .catch(() => console.log('consumer error'));

/**
 * PROD connect sample
 */
//  const upplerSDKPROD = new UpplerSDK({ 
//     debug: 1
// });

// upplerSDKPROD.getOrderById({ id: 386, expanding: ['buyer', 'seller'] })
//     .then(resp => console.log('consumer response'))
//     .catch(() => console.log('consumer error'));
