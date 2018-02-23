const Helper = require('../../helper');

const _lhEnum = ['Low', 'High'];
const _min = 0;
const _max = 40;

class A53003 {
    static decode(rawUserData) {
        const temperature = rawUserData.readUInt8(1);
        const statusOfWake = rawUserData.readUInt8(2) >>> 4;
        const digitalInput3 = rawUserData.readUInt8(2) << 26 >>> 31;
        const digitalInput2 = rawUserData.readUInt8(2) << 27 >>> 31;
        const digitalInput1 = rawUserData.readUInt8(2) << 28 >>> 31;
        const digitalInput0 = rawUserData.readUInt8(2) << 29 >>> 31;
    
        return {
            type: 'digital_input',
            unit: '°C',
            min: _min,
            max: _max,
            temperature: Helper.conversion(temperature, _min, _max, 255, 0),
            wake: _lhEnum[statusOfWake],
            input0: _lhEnum[digitalInput0],
            input1: _lhEnum[digitalInput1],
            input2: _lhEnum[digitalInput2],
            input3: _lhEnum[digitalInput3]
        }
    }

    static encode(cmd) {
        const db3 = Buffer.alloc(1, 0);
        const db2 = Buffer.alloc(1, Helper.conversion2(cmd['temperature'], _min, _max, 255, 0));

        const statusOfWake = _lhEnum.indexOf(cmd['statusOfWake']);
        const digitalInput3 = _lhEnum.indexOf(cmd['digitalInput3']);
        const digitalInput2 = _lhEnum.indexOf(cmd['digitalInput2']);
        const digitalInput1 = _lhEnum.indexOf(cmd['digitalInput1']);
        const digitalInput0 = _lhEnum.indexOf(cmd['digitalInput0']);
        const db1 = Buffer.alloc(1, '000' + parseInt(statusOfWake.toString() + digitalInput3.toString() + digitalInput2.toString() + digitalInput1.toString() + digitalInput0.toString(), 2));
        
        const db0 = Buffer.alloc(1, parseInt('0000' + Number(cmd['learnMode']).toString() + '000', 2));

        const rawUserData = Buffer.concat([db3, db2, db1, db0]);

        return rawUserData;
    }
}

module.exports = A53003;