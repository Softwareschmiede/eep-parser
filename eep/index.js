const EEPs = [];

EEPs['a5-02'] = require('./4BS/a5-02-xx');
EEPs['d5-00-01'] = require('./1BS/d5-00-01');
EEPs['f6-02-01'] = require('./RPS/f6-02-01');

module.exports = EEPs;