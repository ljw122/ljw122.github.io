(function () {
    'use strict';

    var webusbSerialPort = require('webusb-serial').SerialPort;
    var usbDevices = [];
    var elemUsbUtil = $('#usb-connect');
    var us;

    navigator.usb.addEventListener('connect', device => {
        console.log(device);
    });

    // $('.usb-read').on('click', async () => {
    //     let device;
    //     navigator.usb.requestDevice({filters:[{
    //     }]})
    //     .then(selectedDevice => {
    //         device = selectedDevice;
    //         usbDevices.push(device);
    //         elemUsbUtil.show();
    //         return device.open();
    //     })
    //     .catch(error => {console.log(error);});
    //
    // });
    $('.usb-read').on('click', async () => {
        us = await navigator.usb.requestDevice({filters: []});
        await us.open();
        if (us.configuration === null) {
            await us.selectConfiguration(1);
        }
        await us.claimInterface(1);

        await us.isochronousTransferOut(4, new TextEncoder('utf-8').encode('1'), 1);

    });

    $('#usb-btn-list').on('click', '.btn', event => {
        var target = $(event.target);
        console.log(target.data('color'));
    });

})();
