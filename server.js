const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const https = require('https')
const fs = require('fs')

var options = {
  ca: fs.readFileSync('robertfried_land.ca-bundle')
  key: fs.readFileSync('robertfried_land.key')
  cert: fs.readFileSync('robertfried_land.crt')
}

app.use(cors({origin: 'http://localhost:' + (process.env.PORT || 5000)}));

app.use(bodyParser.json())
app.use(express.static('public'));

app.set('view engine', 'ejs')

app.get('/', function(req, res){
  res.writeHead(200, {'Content-Type': 'text/plain'});
   
  // Send the response body as "Hello World"
  res.end('Welcome to the jungle\n');
})

app.get('/homepage', function (req, res) {
  res.render('homepage')
})

app.listen(process.env.PORT || 5000, function () {
  console.log('Homepage listening on port ' + (process.env.PORT || 5000) + '!')
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