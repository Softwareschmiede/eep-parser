'use strict';

/*
 *  Imports
 */
const ESPParser = require('esp-parser');
const Helper = require('./helper');

const _eeps = require('./eep/');
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

    parse(buf) {
        try {
            const packet = new ESPParser(buf);
            //console.log(packet);

            var data = null;

            if (_devices.hasOwnProperty(packet.data.senderId)) {
                const eep = _devices[packet.data.senderId];

                var userData = null;

                if (eep.indexOf('A5-02') !== -1 || eep.indexOf('A5-04') !== -1) {
                    const specialEEP = eep.split('-')[0] + '-' + eep.split('-')[1];
                    const type = eep.split('-')[2];

                    userData = _eeps[specialEEP](packet.data.rawUserData, type);
                } else {
                    userData = _eeps[eep](packet.data.rawUserData);
                }

                data = {
                    eep: eep,
                    learnMode: false,
                    userData: userData
                };
            } else {
                switch (packet.data.rorg) {
                    case 'F6': // RPS
                        data = RPS(packet.data);
                        break;
                    case 'D5': // 1BS
                        data = OneBS(packet.data);
                        break;
                    case 'A5': // 4BS
                        data = FourBS(packet.data);
                        break;
                    default:
                        break;
                }
            }

            if (data !== null) {
                const eepPacket = {
                    learnMode: data.learnMode,
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
        } catch (err) {
            console.log(err);
        }
    }
}

/**
 * 
 * @param {*} packet 
 * @description RPS telegrams don't have a learn bit, so we have to "try" to parse the rawUserData
 */
function RPS(data) {
    // const t21 = Hex2Int(packet.data.status) >>> 5;
    // const nu = Hex2Int(packet.data.status) << 27 >>> 31;

    const rpsEEPKeys = Object.keys(_eeps).filter((eep) => { return eep.indexOf('f6') !== -1; }); // Filter RPS functions

    for (let i = 0; i < rpsEEPKeys.length; i++) { // Iterate over every key and try to parse the rawUserData
        const userData = _eeps[rpsEEPKeys[i]](data.rawUserData);

        if (userData !== null) {
            return {
                eep: rpsEEPKeys[i],
                learnMode: true, // RPS devices don't have a learn mode, so if it's unknown it's a learn telegram with user data
                userData: userData
            }
        }
    }

    return null;
}

/**
 * 
 */
function OneBS(data) {
    const learnMode = data.rawUserData.readUInt8() << 28 >>> 31; // Offset = 4, size = 1

    if (learnMode === 0) { // it's a learn packet
        return {
            eep: data.rorg + '-' + '00' + '-' + '01',
            learnMode: true,
            userData: null
        };
    } else { // No learn packet and device is not known, maybe it's possible to parse the user data anyway
        // TODO: try to parse anyway
        return null;
    }
}

function FourBS(data) {
    const learnMode = data.rawUserData.readUInt8(3) << 28 >>> 31;

    if (learnMode === 0) { // It's a learn packet, so parse it
        const func = ('0' + (data.rawUserData.readUInt8(0) >>> 2).toString(16)).slice(-2);
        const type = ('0' + (data.rawUserData.readUInt16BE(0) << 26 >>> 29).toString(16)).slice(-2);

        var userData = null;

        if (func === '02' || func === '04') { // Temperature devices with only few differents
            userData = _eeps[data.rorg + '-' + func](data.rawUserData, type);
        } else {
            userData = _eeps[data.rorg + '-' + func + '-' + type](data.rawUserData);
        }

        if (userData !== null) {
            return {
                eep: data.rorg + '-' + func + '-' + type,
                learnMode: true,
                userData: userData
            };
        } else {
            return null;
        }
    } else { // Unknown device and no learn packet
        // TODO: Try to parse anyway
        return null;
    }
}

function VLD(data) {
    const reqCode = data.readUInt8(0) >>> 3;
    const manufacturerId = data.readUInt16BE(0) << 5 >>> 5;

}

module.exports = EEPParser;