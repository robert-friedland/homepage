const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const https = require('https')

app.use(cors({origin: 'http://localhost:5000'}));

app.use(bodyParser.json())
app.use(express.static('public'));

app.set('view engine', 'ejs')

app.get('/homepage', function (req, res) {
  res.render('homepage')
})

app.get('/weather', function(req,res){
  console.log('Hello world')
})

app.listen(5000, function () {
  console.log('Homepage listening on port 5000!')
})

app.post('/homepage', function (req, res, next) {
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