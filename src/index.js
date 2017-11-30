import React from 'react'
import ReactDOM from 'react-dom'

class WeatherControl extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      status: 0
    }
  }
  componentDidMount = () => {
    this.loadStatus()
  }
  loadStatus = () => {
    this.setState({ loading: true })
    fetch('/device-status').then((response) => {
      return response.json()
    }).then((data)=>{
      this.setState({
        status: data.status,
        loading: false 
      })
    })
  }
  setStatus = () => {
    fetch("/device-status", {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        status: status === 1 ? 0 : 1 
      })
    }).then((res) => {
      return res.json()
    }).then((data) =>{
      this.loadStatus()
    })
  }
  render() {
    const { loading, status } = this.state
    return (
      <div>
        <h1>{loading ? 'Loading ...' : (status === 1 ? "Device is ON" : "Device is OFF")}</h1>
        <button onClick={this.setStatus} disabled={loading}>Turn {status === 1 ? "OFF" : "ON"}</button>
      </div>
    )
  }
}

ReactDOM.render(
  <WeatherControl />,
  document.getElementById('root')
)