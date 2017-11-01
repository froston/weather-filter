const colors = require('colors/safe');
const helpers = require('./helpers')
const config = require('./config')
const settings = require('./settings')

try {
  if (settings.autoFilter === "on") {
    let deviceStatus = 0;
    helpers.getDeviceStatus((status) => {
      console.log(status ? colors.green("The device is ON") : colors.yellow("The device is OFF"))
      deviceStatus = status;
      // manage device
      if (deviceStatus != null) {
        helpers.getAirQuality((airQuality) => {
          console.log(`Air Quality: ${airQuality}`)
          if (airQuality >= settings.maxValue && deviceStatus == 0) {
            console.log(colors.magenta("Device was set ON!"))
            /* helpers.setDeviceStatus("1", function() {
              console.log("Device is set ON!")
            }) */
          } else if (airQuality < settings.maxValue && deviceStatus == 1) {
            console.log(colors.magenta("Device was set OFF!"))
            /* helpers.setDeviceStatus("0", function() {
              console.log("Device is set OFF!")
            }) */
          } else {
            console.log(colors.magenta(deviceStatus === 1 ? "Device keeps ON" : "Device keeps OFF"))
          }
        })
      }
    })
  }
} catch(err) {
  console.log(colors.red(err))
}