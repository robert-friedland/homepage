const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const https = require('https')

app.use(cors({origin: 'http://localhost:' + (process.env.PORT || 5000)}));

app.use(bodyParser.json())
app.use(express.static('public'));

app.set('view engine', 'ejs')

app.get('/', function(req, res){
  res.render('homer_webpage')
})

app.get('/homepage', function (req, res) {
  res.render('homepage')
})

app.listen(process.env.PORT || 5000, function () {
  console.log('Homepage listening on port ' + (process.env.PORT || 5000) + '!')
})

app.post('/darksky', function (req, res, next){
  const apiKey = process.env.darksky_key
  const latitude = req.body.latitude
  const longitude = req.body.longitude
  var url = `https://api.darksky.net/forecast/${apiKey}/${latitude},${longitude}?exclude=minutely,hourly,daily,alerts,flags`
  https.get(url, (resp) => {
    let data = ''

    resp.on('data', (chunk) => {
      data += chunk
    })

    resp.on('end', () => {
      res.send(data)
    })
  })
})

app.post('/googlemap', function (req, res, next){
  const apiKey = process.env.googlemaps_key
  const latitude = req.body.latitude
  const longitude = req.body.longitude
  var url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}&result_type=locality`
  https.get(url, (resp) => {
    let data = ''

    resp.on('data', (chunk) => {
      data += chunk
    })

    resp.on('end', () => {
      res.send(data)
    })
  })
})

app.post('/openweathermap', function (req, res, next) {
  const apiKey = process.env.owm_key
  const latitude = req.body.latitude
  const longitude = req.body.longitude
  var url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=imperial&APPID=${apiKey}`
  https.get(url, (resp) => {
    let data = ''

    resp.on('data', (chunk) => {
      data += chunk
    })

    resp.on('end', () => {
      res.send(data)
    })
  })
})