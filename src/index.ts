// main library script (central exports)
export { sayHello, sayGoodbye } from './hello-world';

// IIFFE
(function () {
    console.log('index.js executed');
})()