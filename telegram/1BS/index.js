const _eepList = [];

_eepList['D5-00-01'] = require('./eep/D5-00-01');

class OneBS {
    constructor() {}

    decode(rawUserData, eep = null) {
        if (eep) {
            const EEP = _eepList[eep.toUpperCase()];
            const userData = EEP(rawUserData);

            return {
                eep: eep,
                learnMode: false,
                userData: userData
            }
        } else {
            for (let key in _eepList) {
                const learnMode = [true, false];

                const learnBit = rawUserData.readUInt8() << 28 >>> 31; // Offset = 4, size = 1
                const userData = _eepList[key].decode(rawUserData);

                if (userData) {
                    return {
                        eep: key,
                        learnMode: learnMode[learnBit],
                        userData: userData
                    }
                }
            }

            return null;
        }
    }

    encode(cmd, eep) {
        const rorg = Buffer.alloc(1, 'D5', 'hex'); // Always "D5"
        const rawUserData = _eepList[eep].encode(cmd);
        const senderId = Buffer.alloc(8, cmd.senderId, 'hex');
        const status = Buffer.alloc(1, '00', 'hex'); // Always "00"

        const rawData = Buffer.concat([rorg, rawUserData, senderId, status]);

        return rawData;
    }
}

module.exports = OneBS;