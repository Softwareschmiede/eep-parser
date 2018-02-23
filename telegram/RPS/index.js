const _eepList = [];

_eepList['F6-02-01'] = require('./eep/F6-02-01');

class RPS {
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
            // const t21 = Hex2Int(packet.data.status) >>> 5;
            // const nu = Hex2Int(packet.data.status) << 27 >>> 31;

            for (let key in _eepList) {
                const userData = _eepList[key].decode(rawUserData);

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

    encode(cmd, eep) {
        const rorg = Buffer.alloc(1, 'F6', 'hex');
        const rawUserData = _eepList[eep].encode(cmd);
        const senderId = Buffer.alloc(4, cmd['senderId'], 'hex');
        const status = Buffer.alloc(1, '00', 'hex');

        const rawData = Buffer.concat([rorg, rawUserData, senderId, status]);

        return rawData;
    }
}

module.exports = RPS;