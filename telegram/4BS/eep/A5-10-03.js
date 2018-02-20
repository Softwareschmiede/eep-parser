const Helper = require('../../helper');

// const lhEnum = ['Low', 'High'];
const min = 0;
const max = 40;

module.exports = function (rawUserData) {
    const setPoint = rawUserData.readUInt8(1);
    const temperature = rawUserData.readUInt8(2);

    return {
        type: 'room_sensor_control',
        unit: '°C',
        min: min,
        max: max,
        temperature: Helper.conversion(temperature, min, max, 255, 0),
        setPoint: parseInt(Helper.conversion(setPoint, 0, 255, 0, 255))
    }
};