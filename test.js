(function () {
    'use strict';

    var usbDevices = [];
    var bleDevices = [];
    var elemUsbUtil = $('#usb-connect');
    var elemBleUtil = $('#ble-connect');

    $('.usb-read').bind('click', async () => {
        let device;
        // navigator.usb.requestDevice({filters:[{vendorId: 0x2341}]})
        navigator.usb.requestDevice({filters:[]})
        .then(selectedDevice => {
            device = selectedDevice;
            usbDevices.push(device);
            elemUsbUtil.show();
            return device.open();
        })
        // .then(() => device.selectConfiguration(1))
        // .then(() => device.claimInterface(2))
        .catch(error => {console.log(error);});

    });

    $('#usb-btn-list').bind('click', '.btn', event => {
        var target = $(event.target);
        console.log(target.data('color'));
    });

    $('.ble-read').bind('click', async () => {
        let device;
        navigator.bluetooth.requestDevice({filters:[]})
        .then(selectedDevice => selectedDevice.gatt.connect())
        .catch(error => {console.log(error);});
    });

})();
