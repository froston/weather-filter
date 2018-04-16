import express from "express";
import React from "react";
import { renderToString } from "react-dom/server";
import App from "../client/App";
import template from "../client/template";
import helpers from "./helpers";

var PORT = process.env.PORT || 9000

var app = express()

app.use('/', express.static('build'));

app.get('/', (req, res) => {
  var body = renderToString(<App data={{}} />)
  res.send(template({ body: body }));
});

app.use(express.json())

app.get('/device-status', function (req, res) {
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

app.get('/air-quality', function (req, res) {
  helpers.getAirQuality((data) => {
    res.json({ data })
  })
})

app.get('/autofilter', function (req, res) {
  helpers.getAutofilter((autoFilter) => {
    res.json({ autoFilter })
  })
})

app.post('/autofilter', function (req, res) {
  const filterToSet = req.body.autoFilter
  helpers.setAutofilter(filterToSet, (autoFilter) => {
    res.json({ autoFilter })
  })
})

// Run server
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}!`)
});

export default app;