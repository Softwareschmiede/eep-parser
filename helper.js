class Helper {
    static pad(value) {
        const str = value.toString();
        
        return ('0' + str).slice(-2);
    }

    static splitEEP(eepString) {
        const split = eepString.split('-');

        const eep = {
            rorg: split[0],
            func: split[1],
            type: split[2]
        }

        return eep;
    }

    static concatEEP(eep) {
        return eep.rorg + '-' + eep.func + '-' + eep.type;
    }
}

module.exports = Helper;