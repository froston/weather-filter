var snmp = require('snmp-native')
var util = require('util')
var colors = require('colors/safe');

// setup
var host = '213.155.225.213'
var port = 161
var community = 'public'
var oid = [0, 1, 3, 6, 1, 4, 1, 21287, 16, 3, 0]

var session = new snmp.Session({ 
  host: host,
  port: port,
  community: community, 
  // version: snmp.Versions.SNMPv1 
})

// simple get request.
console.log(colors.cyan("Trying to get variables ..."))
session.get({ oid: oid }, function (err, varbinds) {
  if (err) {
    console.log(colors.red(err))
  } else {
    var vb = varbinds[0]
    console.log(colors.green('The system description is "' + vb.value + '"'))
  }
  session.close()
});