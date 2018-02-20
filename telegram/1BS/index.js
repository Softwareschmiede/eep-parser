const _eepList = [];

_eepList['D5-00-01'] = require('./eep/D5-00-01');

let _rawUserData = null;

class OneBS {
    constructor(rawUserData) {
        _rawUserData = rawUserData;
    }

    parse(eep) {
        if (eep) {
            const EEP = _eepList[eep.toUpperCase()];
            const userData = EEP(_rawUserData);

            return {
                eep: eep,
                learnMode: false,
                userData: userData
            }
        } else {
            for (let key in _eepList) {
                const learnMode = [true, false];

                const learnBit = _rawUserData.readUInt8() << 28 >>> 31; // Offset = 4, size = 1
                const userData = _eepList[key](_rawUserData);

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
}

module.exports = OneBS;