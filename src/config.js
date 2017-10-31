var config = {
  // snpm config
  host: 'localhost',
  port: 161,
  readCommunity: '',
  writeCommunity: '',
  oid: [],
  // data
  xmlUrl: "http://portal.chmi.cz/files/portal/docs/uoco/web_generator/AIMdata_hourly.xml",
  stationCode: 'TOVKA', // Opava, CZ
  airQuality: {
    veryGood: 1,
    good: 2,
    satisfying: 3,
    suitable: 4,
    bad: 5,
    veryBad: 6
  }
}

module.exports = config