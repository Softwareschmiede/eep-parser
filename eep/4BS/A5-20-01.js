const Helper = require('../helper');

const min = 0;
const max = 40;
const serviceEnum = ['Off', 'On'];
const booleanEnum = [false, true];
const batteryEnum = [true, false];

module.exports = function(rawUserData) {
    const currentValue = rawUserData.readUInt8(0);
    const serviceOn = rawUserData.readUInt8(1) >>> 7;
    const energyInputEnabled = rawUserData.readUInt8(1) << 25 >>> 31;
    const energyStorage = rawUserData.readUInt8(1) << 26 >>> 31;
    const batteryCapacity = rawUserData.readUInt8(1) << 27 >>> 31;
    const contactCoverOpen = rawUserData.readUInt8(1) << 28 >>> 31;
    const failureTemperatureSensor = rawUserData.readUInt8(1) << 29 >>> 31;
    const detectionWindowOpen = rawUserData.readUInt8(1) << 30 >>> 31;
    const actuatorObstructed = rawUserData.readUInt8(1) << 31 >>> 31;
    const temperature = rawUserData.readUInt8(2);
    const learnMode = rawUserData.readUInt8(3) << 28 >>> 31;

    return {
        type: 'hvac',
        unit: '°C',
        temperature: Helper.conversion(temperature, min, max, 0, 255),
        min: min,
        max: max,
        current: Helper.conversion(currentValue, 0, 100, 0, 100),
        service: serviceEnum[serviceOn],
        energyInput: booleanEnum[energyInputEnabled],
        energyStorage: booleanEnum[energyStorage],
        capacity: batteryEnum[batteryCapacity],
        cover: booleanEnum[contactCoverOpen],
        sensorFailure: booleanEnum[failureTemperatureSensor],
        window: booleanEnum[detectionWindowOpen],
        actuatorState: booleanEnum[actuatorObstructed],
        learnMode: batteryEnum[learnMode]
    }
};