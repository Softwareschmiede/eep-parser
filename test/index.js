const EEPParser = require('../index');


const buf = Buffer.from('55000C070196D207600000000005037D9A0003FFFFFFFF4300FF', 'hex');

const parser = new EEPParser();
parser.addDevices([
    {
        senderId: '05037D9A',
        eep: 'D2-01-00'
    }
]);

//console.log(parser.getDevices());
const userData = parser.parse(buf);

console.log(userData);


// tempSensor.05
// 55000A0701EBA5000088080181383F0003FFFFFFFF4F0018


// roomSensorControl.05
// 55000a0701eba500ff7c080181bb320003ffffffff3d004a
// Learn
// 55000a0701eba540182d800181bb320003ffffffff3d00b5

// hvac
// 55000a0701eba5002087080500ff9d0003ffffffff460030
// Learn
// 55000a0701eba5800849800500ff9d0003ffffffff44007a

// D2
// 55000C070196D207600000000005037D9A0003FFFFFFFF4300FF