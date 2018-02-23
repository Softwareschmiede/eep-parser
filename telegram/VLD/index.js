const _eepList = [];

_eepList['D2-01'] = require('./eep/D2-01-XX');

class VLD {
    constructor() {}

    decode(rawUserData, eep = null) {
        if (eep) {
            // TODO
            const splittedEEP = splitEEP(eep);

            if (splittedEEP['func'] === '01') {
                const userData = _eepList[splittedEEP['rorg'] + '-' + splittedEEP['func']](rawUserData);

                return {
                    eep: eep,
                    learnMode: false,
                    userData: userData
                };
            } else {
                // TODO
            }
        } else {
            // check if ute teach in
            const query = ute(rawUserData);

            if (query && (query['request'] === 0 || query['request'] === 2) && query['cmd'] === 0) {
                // It's a teach in query
                const eep = query['rorg'] + '-' + query['func'] + '-' + query['type'];

                return {
                    eep: eep,
                    learnMode: true,
                    userData: query
                }
            } else {
                // No teach in query
            }
        }
    }
}

module.exports = VLD;

// Universal Uni- and Bidirectional Teach-In (UTE)
function ute(rawUserData) {
    try {
        const communication = rawUserData.readUInt8() << 24 >>> 31; // 0 = unidirectional, 1 = bidirectional
        const response = rawUserData.readUInt8() << 25 >>> 31; // 0 = expected, 1 = not expected
        const request = rawUserData.readUInt8() << 26 >>> 30; // 0 = teach in, 1 = delete, 2 = 0 or 1, 3 = not used
        const cmd = rawUserData.readUInt8() << 28 >>> 28; // 0 = teach in
        const channel = rawUserData.readUInt8(1); // 0 - 254 = specific channel, 255 = all channels
        const manufacturerId8LSB = rawUserData.readUInt8(2);
        const manufacturerId3MSB = rawUserData.readUInt8(3) << 29 >>> 29;

        // EEP
        const type = rawUserData.toString('hex', 4, 5).toUpperCase();
        const func = rawUserData.toString('hex', 5, 6).toUpperCase();
        const rorg = rawUserData.toString('hex', 6, 7).toUpperCase();

        return {
            communication: communication,
            response: response,
            request: request,
            cmd: cmd,
            channel: channel,
            manufacturerId8LSB: manufacturerId8LSB,
            manufacturerId3MSB: manufacturerId3MSB,
            type: type,
            func: func,
            rorg: rorg
        }
    } catch (err) {
        return null;
    }
}

function splitEEP(eep) {
    const split = eep.split('-');

    return {
        rorg: split[0],
        func: split[1],
        type: split[2]
    }
}