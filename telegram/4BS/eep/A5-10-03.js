const Helper = require('../../helper');

// const lhEnum = ['Low', 'High'];
const _min = 0;
const _max = 40;

class A51003 {
    constructor() {}

    static decode(rawUserData) {
        const setPoint = rawUserData.readUInt8(1);
        const temperature = rawUserData.readUInt8(2);

        return {
            type: 'room_sensor_control',
            unit: '°C',
            min: _min,
            max: _max,
            temperature: Helper.conversion(temperature, _min, _max, 255, 0),
            setPoint: parseInt(Helper.conversion(setPoint, 0, 255, 0, 255))
        }
    }

    static encode(cmd) {
        const notUsed = Buffer.alloc(1, 0);
        const setPoint = Buffer.alloc(1, Helper.conversion2(cmd['setPoint'], 0, 255, 0, 255));
        const temperature = Buffer.alloc(1, Helper.conversion2(cmd['temperature'], _min, _max, 255, 0));
        const learnMode = Buffer.alloc(1, 8);

        const rawUserData = Buffer.concat([notUsed, setPoint, temperature, learnMode]);

        return rawUserData;
    }
}

module.exports = A51003;