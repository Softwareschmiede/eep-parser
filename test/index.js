const EEPParser = require('../index');

describe("EEPParser Test", function() {
    const buf = Buffer.from('55000a0701eba500007a080181383f0003ffffffff3d00e5', 'hex');

    const parser = new EEPParser();
    parser.addDevice('0181383f', {rorg: 'a5', func: '02', type: '05'});

    const userData = parser.parse(buf);

    console.log(userData);
});