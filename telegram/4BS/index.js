const _eepList = [];

_eepList['A5-02'] = require('./eep/A5-02-XX');
_eepList['A5-10-03'] = require('./eep/A5-10-03');
_eepList['A5-20-01'] = require('./eep/A5-20-01');
_eepList['A5-30-03'] = require('./eep/A5-30-03');

let _rawUserData = null;

class FourBS {
    constructor(rawUserData) {
        _rawUserData = rawUserData;
    }

    parse(eep) {
        if (eep) {
            const splittedEEP = splitEEP(eep);

            let userData = null;

            // Special call variant, because there are only a few differences while parsing
            if (splittedEEP['func'] === '02' || splittedEEP['func'] === '04') {
                // Call parser with type
                userData = _eepList[splittedEEP['rorg'] + '-' + splittedEEP['func']](_rawUserData, splittedEEP['type']);
            } else {
                userData = _eepList[eep](this.rawUserData);
            }

            return {
                eep: eep,
                learnMode: false,
                userData: userData
            }
        } else {
            const learnMode = [true, false];

            const learnBit = _rawUserData.readUInt8(3) << 28 >>> 31;

            if (learnMode[learnBit]) { // It's a learn packet, so parse it
                const func = ('0' + (_rawUserData.readUInt8(0) >>> 2).toString(16)).slice(-2).toUpperCase();
                const type = ('0' + (_rawUserData.readUInt16BE(0) << 26 >>> 29).toString(16)).slice(-2).toUpperCase();

                const eep = 'A5' + '-' + func + '-' + type;

                let userData = null;

                if (func === '02' || func === '04') {
                    userData = _eepList['A5' + '-' + func](_rawUserData, type);
                } else {
                    userData = _eepList[eep](_rawUserData, type);
                }

                return {
                    eep: eep,
                    learnMode: learnMode[learnBit],
                    userData: userData
                };
            } else { // Not working yet
                
                // for (let key in _eepList) {
                //     const splittedEEP = splitEEP(key);

                //     let userData = null;

                //     if (splittedEEP['func'] === '02' || splittedEEP['func'] === '04') {
                //         userData = _eepList['A5' + '-' + splittedEEP['func']](_rawUserData, '05'); // Test no other
                //     } else {
                //         userData = _eepList[eep];
                //     }

                //     if (userData) {
                //         return {
                //             eep: key,
                //             learnMode: true,
                //             userData: userData
                //         }
                //     }
                // }

                return null;
            }
        }
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

module.exports = FourBS;