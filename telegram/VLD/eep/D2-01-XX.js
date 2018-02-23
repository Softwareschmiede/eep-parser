const _powerFailure = ['Not supported, disabled', 'Enabled'];
const _powerFailureDetection = ['Not detected, not supported, disabled', 'Detected'];
const _overCurrentSwitchOff = ['Ready, not supported', 'Executed'];
const _errorLevel = ['OK', 'Waring', 'Failure', 'Not supported'];
const _unit = ['Energy [Ws]', 'Energy [Wh]', 'Energy [KWh]', 'Power [W]', 'Power [KW]', '', '', ''];

class D201XX {
    static decode(rawUserData) {
        const commandId = rawUserData.readUInt8() << 28 >> 28;
        let response = null;

        switch (commandId) {
            case 4:
                response = cmd4(rawUserData);
                break;
            case 7:
                response = cmd7(rawUserData);
                break;
        }

        return response;
    }

    static encode() {

    }
}

module.exports = D201XX;

function cmd4(rawUserData) {
    const powerFailure = rawUserData.readUInt8() << 24 >>> 31;
    const powerFailureDetection = rawUserData.readUInt8() << 25 >>> 31;
    const overCurrentSwitchOff = rawUserData.readUInt8(1) << 28 >>> 31;
    const errorLevel = rawUserData.readUInt8(1) << 29 >>> 30;

    return {
        cmd: 4,
        powerFailure: _powerFailure[powerFailure],
        powerFailureDetection: _powerFailureDetection[powerFailureDetection],
        overCurrentSwitchOff: _overCurrentSwitchOff[overCurrentSwitchOff],
        errorLevel: _errorLevel[errorLevel]
    };
}

function cmd7(rawUserData) {
    const unit = rawUserData.readUInt8(1) << 24 >> 29; // 0 - 7
    const channel = rawUserData.readUInt8(1) << 27 >> 27; // 0 - 29 = output channel, 30 = do not use, 31 = input channel
    const value = rawUserData.readUInt32BE(2); // 0 - 4294967295 = vaild

    return {
        cmd: 7,
        unit: _unit[unit],
        channel: channel,
        value: value
    };
}