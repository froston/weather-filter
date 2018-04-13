var config = {
  // snpm config
  host: '213.155.225.213',
  port: 161,
  readCommunity: '$?_cr_?3',
  writeCommunity: '$?_cw_?6',
  oid: [0, 1, 3, 6, 1, 4, 1, 21287, 16, 3, 0],
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