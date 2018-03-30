(function() {
    var bleDev, bleServer, bleService, bleCh;
    var btnConn = $('.ble-conn');
    var btnDisconn = $('.ble-disconn');
    var divConn = $('#ble-connected');
    var divState = $('.state-led');

    var service = 0x1234;
    var devUUID = 0xFFE1;
    btnConn.bind('click', function () {
        navigator.bluetooth.requestDevice({filters: [{services: [service]}]})
        .then(device => {
            bleDev = device;
            return bleDev.gatt.connect();
        })
        .then(server => {
            bleServer = server;
            return bleServer.getPrimaryService(service);
        })
        .then(service => {
            bleService = service;
            return bleService.getCharacteristic(devUUID);
        })
        .then(characteristic => {
            bleCh = characteristic;
            return bleCh.startNotifications();
        })
        .then(_ => {
            console.log('Connection Complete!');
            btnDisconn.prop('disabled', false).show();
            divConn.show();
            bleCh.addEventListener('characteristicvaluechanged', e => {
                var value = e.target.value.buffer;
                divState.append($('<li>' + decodeUtf8(value) + '</li>'));
            });
        });
    });

    btnDisconn.bind('click', function () {
        if (bleDev) {
            btnDisconn.prop('disabled', true).hide();
            bleDev.gatt.disconnect();
            bleDev = null;
        }
    });

    $('.led-controler').bind('click', 'li button', function(e) {
        var that = e.target;
        var type = $(that).data('type');
        var uint8array = new TextEncoder('utf-8').encode(type);

        if (!bleCh) {
            alert('기기 연결 안됨!');
        } else {
            bleCh.writeValue(uint8array);
        }
    });

})();
