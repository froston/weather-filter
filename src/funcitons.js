var snmp = require('snmp-native')
var util = require('util')
var colors = require('colors/safe');
var config = require('./config');

// GET DEVICE VALUE
function getDeviceStatus(callback) {
  console.log(colors.cyan("Trying to get value ..."))

  var session = new snmp.Session({ 
    host: config.host,
    port: config.port,
    community: config.readCommunity, 
    version: snmp.Versions.SNMPv1 
  })

  session.get({ oid: config.oid }, function (err, varbinds) {
    if (err) {
      console.log(colors.red(err))
    } else {
      var vb = varbinds[0]
      var output = Number(vb.value);
      callback(output)
    }
    session.close()
  });
}

// SET DEVICE VALUE
function setDeviceStatus(value, callback) {
  console.log(colors.cyan("Trying to set value: " + value + " ..."))

  var session = new snmp.Session({ 
    host: config.host,
    port: config.port,
    community: config.writeCommunity, 
    version: snmp.Versions.SNMPv1 
  })

  session.set({ oid: config.oid, value: value, type: 4 }, function (err, varbinds) {
    if (err) {
      console.log(colors.red(err))
    } else {
      callback()
    }
    session.close()
  });
}

module.exports = {
  getDeviceStatus,
  setDeviceStatus
}