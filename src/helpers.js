const snmp = require('snmp-native')
const http = require('http')
const util = require('util')
const colors = require('colors/safe');
const xml2js = require('xml2js')
const config = require('./config');

// GET DEVICE VALUE
getDeviceStatus = (callback) => {
  console.log(colors.cyan("Trying to get value ..."))
  const session = new snmp.Session({ 
    host: config.host,
    port: config.port,
    community: config.readCommunity, 
    version: snmp.Versions.SNMPv1 
  })

  session.get({ oid: config.oid }, function (err, varbinds) {
    if (err) {
      console.log(colors.red(err))
    } else {
      const vb = varbinds[0]
      const output = Number(vb.value);
      callback(output)
    }
    session.close()
  });
}

// SET DEVICE VALUE
setDeviceStatus = (value, callback) => {
  console.log(colors.cyan("Trying to set value: " + value + " ..."))

  const session = new snmp.Session({ 
    host: config.host,
    port: config.port,
    community: config.writeCommunity, 
    version: snmp.Versions.SNMPv1 
  })
  console.log(colors.magenta(value ? "Device was SUPPOSED TO set ON" : "Device was SUPPOSED TO set OFF"))
  callback(1)
  // TODO: dont allow setting for now
  /* session.set({ oid: config.oid, value: value, type: 4 }, (err, varbinds) => {
    if (err) {
      console.log(colors.red(err))
    } else {
      console.log(colors.magenta("Device was set " + value ? "ON" : "OFF"))
      callback()
    }
    session.close()
  }); */
}

_downloadFile = (url, callback) => {
  const req = http.get(url, (res) => {
    let file = '';
    res.on('data', (chunk) => {
      file += chunk;
    });
    res.on('end', () => {
      callback(file)
    });
  })
  req.on('error', (err) => {
    console.error(colors.red(`Error downloading file ${url}: ${err}`))
  });
}

_getWeatherData = (callback) => {
  _downloadFile(config.xmlUrl, (xml) => {
    try {
      var parser = new xml2js.Parser({ explicitArray: false });
      parser.parseString(xml, (err, result) => {
        const stations = result.AQ_hourly_index.Data.station
        const station = stations.find((obj) => {
          return obj.code === config.stationCode
        })
        // get weather data
        const data = {}
        const arr = station.measurement      
        for (var i = 0; i < arr.component.length; i++) {
          data[arr.component[i]] = arr.averaged_time[i].value
        }
        callback(data)
      })
    } catch (err) {
      console.error(colors.red(`Error parsing XML file: ${err}`))
    }
    
  })
}

getAirQuality = (callback) => {
  _getWeatherData((data) => {
    const fNO2 = Number(data['NO2']) // Oxid dusičitý - NO2 1H µg/m³
    const fO3 = Number(data['O3']) // Ozón - O3 1H µg/m³
    const fPM10 = Number(data['PM10']) // Pevné částice - PM10 1H µg/m³
    let quality = null
    if (fNO2 && fO3 && fPM10) {
      if (fNO2 > 0 && fO3 > 0 && fPM10 > 0) {
        quality = config.airQuality.veryGood
      }
      if (fNO2 > 25 && fO3 > 33 && fPM10 > 20) {
        quality = config.airQuality.good
      }
      if (fNO2 > 50 && fO3 > 65 && fPM10 > 40) {
        quality = config.airQuality.satisfying
      }
      if (fNO2 > 100 && fO3 > 120 && fPM10 > 70) {
        quality = config.airQuality.suitable
      }
      if (fNO2 > 200 && fO3 > 180 && fPM10 > 90) {
        quality = config.airQuality.bad
      }
      if (fNO2 > 400 && fO3 > 240 && fPM10 > 180) {
        quality = config.airQuality.veryBad
      }
    }
    callback(quality)
  })
}

module.exports =  {
  getDeviceStatus,
  setDeviceStatus,
  getAirQuality
}