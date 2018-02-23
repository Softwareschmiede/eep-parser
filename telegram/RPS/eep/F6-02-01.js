const _button = {
    '00': 'Released',
    '10': 'AI',
    '30': 'A0',
    '50': 'BI',
    '70': 'B0'
}

class F60201 {
    constructor() {}

    static decode(rawUserData) {
        const button = rawUserData.toString('hex');

        return {
            type: 'switch',
            button: _button[button]
        }
    }

    static encode(cmd) {
        const button = Object.keys(_button).find(key => { return _button[key] === cmd['value']; }) // magic
        const rawUserData = Buffer.from(button.toString(), 'hex');

        return rawUserData;
    }
}

module.exports = F60201;