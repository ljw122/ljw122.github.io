(function () {
    'use strict';

    var usbDevices = [];
    var elemUsbUtil = $('#usb-connect');

    navigator.usb.addEventListener('connect', device => {
        console.log(device);
    });

    $('.usb-read').bind('click', async () => {
        let device;
        navigator.usb.requestDevice({filters:[]})
        .then(selectedDevice => {
            device = selectedDevice;
            usbDevices.push(device);
            elemUsbUtil.show();
            return device.open();
        })
        .catch(error => {console.log(error);});

    });


    $('#usb-btn-list').bind('click', '.btn', event => {
        var target = $(event.target);
        console.log(target.data('color'));
    });

})();
