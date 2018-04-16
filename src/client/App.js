import React from 'react'
import ReactDOM from 'react-dom'
import { MuiThemeProvider } from 'material-ui/styles';
import { RaisedButton } from 'material-ui';
import { Card, CardTitle, CardText } from 'material-ui/Card';
import Toggle from 'material-ui/Toggle';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      autoFilter: false,
      status: 0
    }
  }
  componentDidMount = () => {
    this.loadData()
  }
  loadData = () => {
    this.loadStatus()
    this.loadAutoFilter()
  }
  loadStatus = () => {
    this.setState({ loading: true })
    fetch('/device-status').then((response) => {
      return response.json()
    }).then((data) => {
      this.setState({
        status: data.status,
        loading: false
      })
    })
  }
  loadAutoFilter = () => {
    this.setState({ loading: true })
    fetch('/autofilter').then((response) => {
      return response.json()
    }).then((data) => {
      this.setState({
        autoFilter: data.autoFilter,
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
    }).then((data) => {
      this.loadData()
    })
  }
  setAutofilter = (event, val) => {
    fetch("/autofilter", {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        autoFilter: val
      })
    }).then((res) => {
      return res.json()
    }).then((data) => {
      this.loadData()
    })
  }
  render() {
    const { loading, status } = this.state
    const { data } = this.props
    const test = [
      { name: 'NO2', value: 100 },
      { name: 'O3', value: 65 },
      { name: 'PM10', value: 40 },
    ];
    return (
      <MuiThemeProvider>
        <Card>
          <CardTitle title={(status === 1 ? "Device is ON" : "Device is OFF")} />
          <CardText>
            <BarChart width={600} height={300} data={test} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey='value' fill='#8884d8' />
            </BarChart>
            <Toggle
              label="Auto-filter"
              labelPosition="right"
              onToggle={this.setAutofilter}
              toggled={this.state.autoFilter}
              style={{ marginBottom: 10 }}
            />
            <RaisedButton disabled={loading} onClick={this.setStatus}>
              Turn {status === 1 ? "OFF" : "ON"}
            </RaisedButton>
          </CardText>
        </Card>
      </MuiThemeProvider>
    )
  }
}

export default App