(function () {
    'use strict';

    var device = null;
    var elemUsbUtil = $('#usb-connect');

    navigator.usb.addEventListener('connect', device => {
        console.log(device);
    });

    $('.usb-read').on('click', async () => {
        navigator.usb.requestDevice({filters:[]})
        .then(selectedDevice => {
            device = selectedDevice;
            elemUsbUtil.show();
            return device.open();
        })
        .catch(error => {console.log(error);});

    });

    $('.control-transfer-out').on('click', function (e) {
        let command = $('.command').val();
        let requestType = $('.request-type').val();
        let recipient = $('.recipient').val();
        let request = $('.request').val();
        let value = $('.value').val();
        let index = $('.index').val();
        let setup = {
            requestType: requestType,
            recipient: recipient,
            request: request,
            value: value,
            index: index
        };

        device.controlTransferOut(setup, new TextEncoder('utf-8').encode(command))
        .then(data => {
            console.log(data);
        })
        .catch(error => {
            console.log(error);
        });
    });

})();
