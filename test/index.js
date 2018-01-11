const EEPParser = require('../index');

describe("EEPParser Test", function() {
    const buf = Buffer.from('55000a0701eba500007a080181383f0003ffffffff3d00e5', 'hex');

    const parser = new EEPParser();
    parser.addDevices([{senderId: '0181383f', eep: 'a5' + '-' + '02' + '-' + '05'}, {senderId: '00000000', eep: 'a5' + '-' + '02' + '-' + '05'}]);

    console.log(parser.getDevices());
    const userData = parser.parse(buf);

    //console.log(userData);
});