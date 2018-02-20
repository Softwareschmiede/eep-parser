const RPS = require('./RPS');
const OneBS = require('./1BS');
const FourBS = require('./4BS');

let _telegram = null;

class Telegram {
    constructor(rorg, rawUserData) {
        switch (rorg) {
            case 'F6':
                _telegram = new RPS(rawUserData);
                break;
            case 'D5':
                _telegram = new OneBS(rawUserData);
                break;
            case 'A5':
                _telegram = new FourBS(rawUserData);
                break;
            case 'D2':
            default:
                _telegram = null;
                break;
        }
    }

    parse(eep) {
        if (eep) {
            return _telegram.parse(eep);
        } else {
            const result = _telegram.parse();
            return result;
        }
    }
}

module.exports = Telegram;