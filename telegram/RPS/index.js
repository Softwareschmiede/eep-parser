const _eepList = [];

_eepList['F6-02-01'] = require('./eep/F6-02-01');

let _rawUserData = null;

class RPS {
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
            // const t21 = Hex2Int(packet.data.status) >>> 5;
            // const nu = Hex2Int(packet.data.status) << 27 >>> 31;

            for (let key in _eepList) {
                const userData = _eepList[key](_rawUserData);

                if (userData) {
                    return {
                        eep: key,
                        learnMode: true,
                        userData: userData
                    }
                }
            }

            return null;
        }
    }
}

module.exports = RPS;