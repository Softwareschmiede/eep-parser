const Helper = require('../helper');

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
    const temperature = Helper.conversion(rawUserData.readUInt8(2), 0, 255, 0, 40); // Helper
    const learnMode = rawUserData.readUInt8(3) >>> 3;
    
    // return {
    //     type: 'temperature',
    //     unit: '°C',
    //     min: sensor.min,
    //     max: sensor.max,
    //     value: Helper.conversion(temperature, sensor.min, sensor.max, 0, 255)
    // }
};