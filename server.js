const express = require('express')
var cors = require('cors')
const app = express()
const bodyParser = require('body-parser')

app.use(cors({origin: 'http://localhost:3000'}));
app.use(bodyParser.raw({type: 'application/x-www-form-urlencoded'}))
app.use(express.static('public'));

app.set('view engine', 'ejs')

app.get('/', function (req, res) {
  res.render('agenda')
})

app.listen(3000, function () {
  console.log('Sales Engineering Hub listening on port 3000!')
})

app.post('/', function (req, res, next) {
  const apiKey = process.env.API_KEY;
  const path = req.body.toString();
  const sha = new jsSHA('SHA-256', 'TEXT');
  sha.setHMACKey(apiKey, 'TEXT');
  sha.update(path);
  const signature = sha.getHMAC('HEX');
  const url = `https://app.periscopedata.com${path}&signature=${signature}`
  res.send(url);
})