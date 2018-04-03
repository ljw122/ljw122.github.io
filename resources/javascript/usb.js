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
        .then(_ => {
            return device.claimInterface(1);
        })
        .catch(error => {console.log(error);});

    });

    $('.control-transfer-out').on('click', function (e) {
        let self = $(e.target);
        let command = self.closest('.command').val();
        let setup = getControlTransferSetup(self);

        device.controlTransferOut(setup, new TextEncoder('utf-8').encode(command))
        .then(data => {
            console.log(data);
        })
        .catch(error => {
            console.log(error);
        });
    });

    $('.control-transfer-in').on('click', function (e) {
        let self = $(e.target);
        let command = self.closest('.command').val();
        let setup = getControlTransferSetup(self);

        device.controlTransferIn(setup, command)
        .then(data => {
            console.log(data);
        })
        .catch(error => {
            console.log(error);
        });
    });

    function getControlTransferSetup(self) {
        let li = self.closest('li');
        let requestType = li.find('.request-type').val();
        let recipient = li.find('.recipient').val();
        let request = li.find('.request').val();
        let value = li.find('.value').val();
        let index = li.find('.index').val();
        let setup = {
            requestType: requestType,
            recipient: recipient,
            request: request,
            value: value,
            index: index
        };

        return setup;
    }

})();
