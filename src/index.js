var colors = require('colors/safe');
var functions = require('./funcitons')

try {
  var deviceStatus = 0;
  functions.getDeviceStatus(function (status) {
    console.log(status ? colors.green("The device is ON") : colors.yellow("The device is OFF"))
    deviceStatus = status;
    // manage device
    if (deviceStatus != null) {
      if (deviceStatus == 0) {
        /* functions.setDeviceStatus("1", function() {
          console.log("Device is set ON!")
        }) */
      } else {
        /* functions.setDeviceStatus("0", function() {
          console.log("Device is set OFF!")
        }) */
      }
    }
  })
} catch(Exception) {
  console.log(colors.red("error", Exception))
}