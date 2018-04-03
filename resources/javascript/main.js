requirejs.config({
    paths: {
        'webusb-serial': '../../node_modules/webusb-serial/index',
    }
});

requirejs([
    'webusb-serial'
]);
