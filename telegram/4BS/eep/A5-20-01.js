const Helper = require('../../helper');

const _min = 0;
const _max = 40;
const _serviceEnum = ['Off', 'On'];
const _booleanEnum = [false, true];
const _batteryEnum = [true, false];

class A52001 {
    static decode(rawUserData) {
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

        return {
            type: 'hvac',
            unit: '°C',
            temperature: Helper.conversion(temperature, _min, _max, 0, 255),
            min: _min,
            max: _max,
            current: Helper.conversion(currentValue, 0, 100, 0, 100),
            service: _serviceEnum[serviceOn],
            energyInput: _booleanEnum[energyInputEnabled],
            energyStorage: _booleanEnum[energyStorage],
            capacity: _batteryEnum[batteryCapacity],
            cover: _booleanEnum[contactCoverOpen],
            sensorFailure: _booleanEnum[failureTemperatureSensor],
            window: _booleanEnum[detectionWindowOpen],
            actuatorState: _booleanEnum[actuatorObstructed]
        }
    }

    static encode(cmd) {
        const db3 = Buffer.alloc(1, cmd['']);   // Valve position: Range(0 - 100) Scale(0 - 100) Unit(%) 
                                                // SetPoint: Range(0 - 255) Scale(0 - +40) Unit(°C)
        const db2 = Buffer.alloc(1, cmd['']); // Range(255 - 0) Scale(0 - +40) Unit(°C)

        const runInitSequence = 1; // 0 = False, 1 = True
        const liftSet = 1; // 0 = False, 1 = True
        const valveOpen = 1; // 0 = False, 1 = True
        const valveClosed = 1; // 0 = False, 1 = True
        const summerBit = 1; // 0 = False, 1 = True
        const setPointSelection = cmd['']; // 0 = valve position (0 - 100%), 1 = SetPoint (0 - +40°C)
        const setPointReverse = 1; // 0 = False, 1 = True
        const selectFunction = 0; // 0 = RCU (Controller), 1 = service on (service device)
        const db1 = Buffer.alloc(parseInt(runInitSequence.toString() + liftSet.toString() + valveOpen.toString() + valveClosed.toString() + summerBit.toString() + setPointSelection.toString() + setPointReverse.toString() + selectFunction.toString(), 2));


        const learnMode = 1; // 0 = teach in, 1 = data
        const db0 = Buffer.alloc(1, parseInt('0000' + learnMode.toString() + '000', 2));

        const rawUserData = Buffer.concat([db3, db2, db1, db0]);

        return rawUserData;
    }
}

module.exports = A52001;