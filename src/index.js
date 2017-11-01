import React from 'react'
import ReactDOM from 'react-dom'

import snmp from 'snmp-native'

const WeatherControl = () => {
  getIt = () => {
    getDeviceStatus((res) => {
      return res
    })
  }
  return <h1>{getIt() === 1 ? "ON" : "OFF"}</h1>
}

ReactDOM.render(
  <WeatherControl />,
  document.getElementById('root')
)