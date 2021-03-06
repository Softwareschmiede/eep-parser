'use strict';

/*
 *  Imports
 */
const ESPParser = require('esp-parser');
// const Helper = require('./helper');

// const _eeps = require('./eep/');
const Telegram = require('./telegram');
var _devices = null; // Object for faster access


class EEPParser {
    constructor(options) {
        if (options === undefined || options === null) {
            options = {};
        }

        _devices = (options.knownDevices && typeof options.knownDevices === Array && options.knownDevices.length > 0) ? this.addDevices(options.knownDevices) : {};
    }

    getDevices() {
        const devices = [];

        Object.keys(_devices).forEach((key) => {
            const device = {
                senderId: key,
                eep: _devices[key]
            };

            devices.push(device);
        });

        return devices;
    }

    addDevice(senderId, eep) {
        senderId = senderId.toUpperCase();
        eep = eep.toUpperCase();

        if (_devices[senderId] === undefined) {
            _devices[senderId] = eep;
        }
    }

    addDevices(devices) {
        for (let i = 0; i < devices.length; i++) {
            const device = devices[i];

            this.addDevice(device.senderId, device.eep);
        }
    }

    removeDevice(senderId) {
        delete _devices[senderId];
    }

    decode(buf) {
        try {
            const packet = new ESPParser(buf);

            console.log(packet);

            const telegram = new Telegram(packet['data']['rorg']);

            let result = null;

            if (_devices.hasOwnProperty(packet.data.senderId)) {
                result = telegram.decode(packet['data']['rawUserData'], _devices[packet.data.senderId]);
            } else {
                result = telegram.decode(packet['data']['rawUserData']);
            }

            if (result) {
                const eepPacket = {
                    learnMode: result.learnMode,
                    eep: result.eep,
                    senderId: packet.data.senderId,
                    status: packet.data.status,
                    data: result.userData,
                    subTelNum: packet.optionalData.subTelNum,
                    destinationId: packet.optionalData.destinationId,
                    dBm: packet.optionalData.dBm,
                    securityLevel: packet.optionalData.securityLevel
                };

                return eepPacket;
            } else {
                return null;
            }
        } catch (err) {
            console.log(err);
        }
    }

    encode(cmd) {
        if (cmd) {
            const eep = _devices[cmd.senderId];
            const rorg = eep.split('-')[0];

            const telegram = new Telegram(rorg)
            const cmdEncoded = telegram.encode(cmd);
        } else {
            throw new TypeError('No command');
        }
    }
}

module.exports = EEPParser;