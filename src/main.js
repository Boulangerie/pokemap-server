'use strict'

const express  = require('express')
const bodyParser = require('body-parser')

const User = require('./User.class.js')

const app = express()

app.set('json spaces', 2)

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type')
  next()
})

app.listen(3000, () => {
  console.log('listening on port 3000!')
})

let errorIt = (res, err) => res.json({error: err})

app.get('/', (req, res) => {
  let routes = app._router.stack
    .filter(val => val.route)
    .map(val => `${val.route.stack[0].method.toUpperCase()} ${val.route.path}`)

  res.json(200, routes)
})

app.post('/login', (req, res) => {
  let method = req.body.method
  var config = require('./config.json')
  var user = new User(config)
  user.login().then(() => {
    res.json({'status': 'valid'})
  })
})

app.get('/getHeartbeat/:coords', (req, res) => {
  var latitude = parseFloat(req.params.coords.split(',')[0], 10)
  var longitude = parseFloat(req.params.coords.split(',')[1], 10)
  user
    .setLocation(latitude, longitude)
    .then(function(location) {
      console.log(user.uuid, location)
      return user.getHeartbeat()
    })
    .then(function(heartbeat) {
      res.json(heartbeat)
    })
    .catch(function(err) {
      errorIt(res, err)
    })
})
