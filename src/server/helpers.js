import path from "path";
import { writeFile } from "fs";
import { Session, Versions } from "snmp-native";
import { get } from "http";
import util from "util";
import { cyan, red, magenta } from "colors/safe";
import { Parser } from "xml2js";
import { host as _host, port as _port, readCommunity, oid as _oid, writeCommunity, xmlUrl, stationCode, airQuality } from "./config";
import settings from './settings.json'

// GET DEVICE VALUE
function getDeviceStatus(callback) {
  console.log(cyan("Trying to get value ..."))
  var session = new Session({
    host: _host,
    port: _port,
    community: readCommunity,
    version: Versions.SNMPv1
  })

  session.get({ oid: _oid }, function (err, varbinds) {
    if (err) {
      console.log(red(err))
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
  console.log(cyan("Trying to set value: " + value + " ..."))

  var session = new Session({
    host: _host,
    port: _port,
    community: writeCommunity,
    version: Versions.SNMPv1
  })
  console.log(magenta(value ? "Device was SUPPOSED TO set ON" : "Device was SUPPOSED TO set OFF"))
  callback(1)
  // TODO: dont allow setting for now
  /* session.set({ oid: config.oid, value: value, type: 4 }, function(err, varbinds) {
    if (err) {
      console.log(colors.red(err))
    } else {
      console.log(colors.magenta("Device was set " + value ? "ON" : "OFF"))
      callback()
    }
    session.close()
  }); */
}

function _downloadFile(url, callback) {
  var req = get(url, function (res) {
    let file = '';
    res.on('data', function (chunk) {
      file += chunk;
    });
    res.on('end', function () {
      callback(file)
    });
  })
  req.on('error', function (err) {
    console.error(red(`Error downloading file ${url}: ${err}`))
  });
}

function _getWeatherData(callback) {
  _downloadFile(xmlUrl, function (xml) {
    try {
      var parser = new Parser({ explicitArray: false });
      parser.parseString(xml, function (err, result) {
        var stations = result.AQ_hourly_index.Data.station
        var station = stations.find(function (obj) {
          return obj.code === stationCode
        })
        // get weather data
        var data = {}
        var arr = station.measurement
        for (var i = 0; i < arr.component.length; i++) {
          data[arr.component[i]] = arr.averaged_time[i].value
        }
        callback(data)
      })
    } catch (err) {
      console.error(red(`Error parsing XML file: ${err}`))
    }

  })
}

function getAirQuality(callback) {
  _getWeatherData(function (data) {
    var fNO2 = Number(data['NO2']) // Oxid dusičitý - NO2 1H µg/m³
    var fO3 = Number(data['O3']) // Ozón - O3 1H µg/m³
    var fPM10 = Number(data['PM10']) // Pevné částice - PM10 1H µg/m³
    var quality = null
    if (fNO2 && fO3 && fPM10) {
      if (fNO2 > 0 && fO3 > 0 && fPM10 > 0) {
        quality = airQuality.veryGood
      }
      if (fNO2 > 25 && fO3 > 33 && fPM10 > 20) {
        quality = airQuality.good
      }
      if (fNO2 > 50 && fO3 > 65 && fPM10 > 40) {
        quality = airQuality.satisfying
      }
      if (fNO2 > 100 && fO3 > 120 && fPM10 > 70) {
        quality = airQuality.suitable
      }
      if (fNO2 > 200 && fO3 > 180 && fPM10 > 90) {
        quality = airQuality.bad
      }
      if (fNO2 > 400 && fO3 > 240 && fPM10 > 180) {
        quality = airQuality.veryBad
      }
    }
    callback({ quality: quality, data: data })
  })
}

function getAutofilter(callback) {
  callback(settings.autoFilter)
}

function setAutofilter(val, callback) {
  settings.autoFilter = val
  writeFile('build/settings.json', JSON.stringify(settings, null, 2), function (err) {
    if (err) throw err
    callback(settings.autoFilter)
  });
}

const getData = (callback) => {
  getDeviceStatus(status => {
    getAutofilter(autoFilter => {
      getAirQuality(data => {
        callback({
          status,
          autoFilter,
          data
        })
      })
    })
  })
}

export default {
  getDeviceStatus,
  setDeviceStatus,
  getAirQuality,
  getAutofilter,
  setAutofilter,
  getData
};