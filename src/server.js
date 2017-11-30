// server/app.js
const express = require('express')
const path = require('path')
const helpers = require('./helpers')

const PORT = process.env.PORT || 9000

const app = express()

// Serve static assets
app.use(express.static(path.resolve(__dirname, '../build')))

app.use(express.json())

// Always return the main index.html, so react-router render the route in the client
app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../build', 'index.html'))
});

app.get('/device-status', function(req, res) {
  helpers.getDeviceStatus((status) => {
    res.json({ status })
  })
})
  
app.post('/device-status', function (req, res) {
  const statusToSet = req.body.status
  helpers.setDeviceStatus(statusToSet, (status) => {
    res.json({ status })
  })
})

// Run server
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}!`)
});

module.exports = app