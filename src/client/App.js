import React from 'react'
import ReactDOM from 'react-dom'
import { MuiThemeProvider } from 'material-ui/styles';
import { MenuItem } from 'material-ui/Menu';
import { FormGroup, FormControlLabel } from 'material-ui/Form';
import Card, { CardContent, CardHeader, CardMedia, } from 'material-ui/Card';
import { AppBar, Grid, Switch, Select, Typography, Toolbar, Icon } from 'material-ui';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      autoFilter: false,
      maxValue: 1,
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
      { name: 'PM10', value: 50 },
    ];
    return (
      <div style={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="title" color="inherit">
              Weather Control
            </Typography>
          </Toolbar>
        </AppBar>
        <br />
        <Grid container spacing={16}>
          <Grid item sm={6}>
            <Card>
              <CardMedia
                image="http://afss.ca/wp-content/uploads/2014/07/nature-770x400px.jpg"
                title="Contemplative Reptile"
                style={{
                  height: 0,
                  paddingTop: '20%'
                }}
              />
              <CardContent>
                <Typography gutterBottom variant="headline" component="h2">
                  Actual Air Condition
                  </Typography>
                <Typography component="p">
                  The weather is nice
                  </Typography>
                <br />
                <BarChart width={600} height={300} data={test} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey='value' fill='green' />
                </BarChart>
              </CardContent>
            </Card>
          </Grid>
          <Grid item sm={6}>
            <Card>
              <CardContent>
                <Typography variant="headline" gutterBottom><Icon color="action">settings</Icon>Settings</Typography>
                <FormGroup row>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={this.state.autoFilter}
                        onChange={this.setAutofilter}
                        color="primary"
                      />
                    }
                    label="Auto-filter"
                  />
                </FormGroup>
                <FormGroup row>
                  <FormControlLabel
                    control={
                      <Select
                        value={this.state.maxValue}
                        onChange={this.handleChange}
                        style={{ width: 120 }}
                      >
                        <MenuItem value="">
                          <em>None</em>
                        </MenuItem>
                        <MenuItem value={1}>Ten</MenuItem>
                        <MenuItem value={2}>Twenty</MenuItem>
                        <MenuItem value={3}>Thirty</MenuItem>
                      </Select>
                    }
                    label="Turn on filter when"
                  />
                </FormGroup>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </div >
    )
  }
}

export default App