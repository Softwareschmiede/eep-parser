const EEPs = [];

EEPs['A5-02'] = require('./4BS/A5-02-XX');
EEPs['A5-10-03'] = require('./4BS/A5-10-03');
EEPs['A5-20-01'] = require('./4BS/A5-20-01');
EEPs['A5-30-03'] = require('./4BS/A5-30-03');
EEPs['D5-00-01'] = require('./1BS/D5-00-01');
EEPs['F6-02-01'] = require('./RPS/F6-02-01');

module.exports = EEPs;