module.exports = function (rawUserData) {
    const commandId = rawUserData.readUInt8();
    
    // const temperature = rawUserData.readUInt8(2);

    // return {
    //     type: 'room_sensor_control',
    //     unit: '°C',
    //     min: min,
    //     max: max,
    //     temperature: Helper.conversion(temperature, min, max, 255, 0),
    //     setPoint: parseInt(Helper.conversion(setPoint, 0, 255, 0, 255))
    // }
};