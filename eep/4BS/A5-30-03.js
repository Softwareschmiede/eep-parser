const Helper = require('../helper');

const lhEnum = ['Low', 'High'];
const min = 0;
const max = 40;

module.exports = function (rawUserData) {
    const temperature = rawUserData.readUInt8(1);
    const statusOfWake = rawUserData.readUInt8(2) >>> 4;
    const digitalInput3 = rawUserData.readUInt8(2) << 26 >>> 31;
    const digitalInput2 = rawUserData.readUInt8(2) << 27 >>> 31;
    const digitalInput1 = rawUserData.readUInt8(2) << 28 >>> 31;
    const digitalInput0 = rawUserData.readUInt8(2) << 29 >>> 31;
    const learnMode = rawUserData.readUInt8(3) >>> 3;

    return {
        type: 'digital_input',
        unit: '°C',
        min: min,
        max: max,
        temperature: Helper.conversion(temperature, min, max, 255, 0),
        wake: lhEnum[statusOfWake],
        input0: lhEnum[digitalInput0],
        input1: lhEnum[digitalInput1],
        input2: lhEnum[digitalInput2],
        input3: lhEnum[digitalInput3]
    }
};