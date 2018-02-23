const RPS = require('./RPS');
const OneBS = require('./1BS');
const FourBS = require('./4BS');
const VLD = require('./VLD');

let _telegram = null;

class Telegram {
    constructor(rorg) {
        switch (rorg) {
            case 'F6':
                _telegram = new RPS();
                break;
            case 'D5':
                _telegram = new OneBS();
                break;
            case 'A5':
                _telegram = new FourBS();
                break;
            case 'D2':
                _telegram = new VLD();
                break;
            default:
                _telegram = null;
                break;
        }
    }

    decode(rawUserData, eep = null) {
        if (eep) {
            return _telegram.decode(rawUserData, eep);
        } else {
            const result = _telegram.decode(rawUserData);
            return result;
        }
    }

    encode(cmd, eep) {
        const rawData = _telegram.encode(cmd, eep);

        return rawData;
    }
}

module.exports = Telegram;