'use strict';

/*
 *  Imports
 */
const ESPParser = require('esp-parser');
const Helper = require('./helper');

const _eeps = require('./eep/');
const _devices = {}; // Object for faster access


class EEPParser {
    constructor(options) {

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
        if (_devices[senderId] === undefined) {
            _devices[senderId] = eep;
        }
    }

    addDevices(devices) {
        for (let i = 0; i < devices.length; i++) {
            this.addDevice(device.senderId, device.eep);
        }
    }

    removeDevice(senderId) {
        delete _devices[senderId];
    }

    parse(buf) {
        const packet = new ESPParser(buf);

        console.log(packet);

        var data = null;

    switch (packet.data.rorg) {
        case 'f6': // RPS
            data = RPS(packet);
            break;
        case 'd5': // 1BS
            data = OneBS(packet);
            break;
        case 'a5': // 4BS
            data = FourBS(packet);
            break;
        default:
            break;
    }

        if (data !== null) {
            const eepPacket = {
                //learnMode: data.learnMode,
                eep: data.eep,
                senderId: packet.data.senderId,
                status: packet.data.status,
                data: data.userData,
                subTelNum: packet.optionalData.subTelNum,
                destinationId: packet.optionalData.destinationId,
                dBm: packet.optionalData.dBm,
                securityLevel: packet.optionalData.securityLevel
            };

            return eepPacket;
        } else {
            return null;
        }
    }

}

/**
 * 
 * @param {*} packet 
 * @description RPS telegrams don't have a learn bit, so we have to "try" to parse the rawUserData
 */
function RPS(packet) {
    if (_devices.hasOwnProperty(packet.data.senderId)) {
        const userData = _eeps[_devices[packet.data.senderId]](packet.data.rawUserData);

        const data = {
            eep: _devices[packet.data.senderId],
            learnMode: false,
            userData: userData
        };

        return data;
    } else {

        const t21 = Hex2Int(packet.data.status) >>> 5;
        const nu = Hex2Int(packet.data.status) << 27 >>> 31;

        const rpsEEPKeys = Object.keys(_eeps).filter((eep) => { return eep.indexOf('f6') !== -1; }); // Filter RPS functions
        const data = {
            eep: null,
            learnMode: true,
            userData: null
        };

        for (let i = 0; i < rpsEEPKeys.length; i++) { // Iterate over every key and try to parse the rawUserData
            const rpsData = _eeps[rpsEEPKeys[i]](packet.data.rawUserData);

            if (rpsData !== null) {
                data.eep = Helper.splitEEP(rpsEEPKeys[i]);
                data.userData = rpsData;
                break;
            }
        }

        if (data.eep !== null && data.userData !== null) {
            return data;
        } else {
            return null;
        }
    }
}

/**
 * 
 */
function OneBS(packet) {
    const learnMode = packet.data.rawUserData.readUInt8() << 28 >>> 31; // Offset = 4, size = 1

    if (learnMode === 0) { // it's a learn packet
        return {
            eep: {
                rorg: packet.data.rorg,
                func: '00',
                type: '01'
            },
            learnMode: true
        };
    } else {
        return _eeps['d5-00-01'](packet);
    }
}

function FourBS(packet) {
    const learnMode = packet.data.rawUserData.readUInt8(3) << 28 >>> 31;

    if (learnMode === 1 && _devices.hasOwnProperty(packet.data.senderId)) { // It's a known device, so parse it
        const eep = _devices[packet.data.senderId];

        if (eep.func === '02' || eep.func === '04') {
            const userData = _eeps[eep.rorg + '-' + eep.func](packet.data.rawUserData, eep.type);

            const data = {
                eep: eep,
                learnMode: false,
                userData: userData
            };

            return data;
        } else {
            return _eeps[eep.rorg + '-' + eep.func + '-' + eep.type](packet.data.rawUserData);
        }
    } else if (learnMode === 0) {
        const func = Helper.pad(packet.data.rawUserData.readUInt8() >>> 2);
        const type = Helper.pad(packet.data.rawUserData.readUInt16BE() << 22 >>> 25);

        const eep = { rorg: packet.data.rorg, func: func, type: type };

        return eep;
    } else { // Unknown device or unknown eep
        return null;
    }
}

function Hex2Int(hex) {
    return parseInt(hex, 16);
}

module.exports = EEPParser;