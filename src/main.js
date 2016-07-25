'use strict'

const express  = require('express')
const bodyParser = require('body-parser')
const session = require('express-session')

const config = require('./config.json')

const Utils = require('./Utils.class.js')
const User = require('./User.class.js')

const app = express()

app.set('json spaces', 2)

app.use(session({
  secret: 'myAwesomeSecret',
  cookie: {},
  resave: true,
  saveUninitialized: true
}))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use((req, res, next) => {
  // Create user attached to the session
  let pokeUser = null
  if (!req.session.pokeUserId) {
    req.session.pokeUser = User.addUser()
    req.session.pokeUserId = req.session.pokeUser.uuid
  } else {
    req.session.pokeUser = User.list.find(v => v.uuid === req.session.pokeUserId)
  }

  // Set CORS headers
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
  res.status(200).json(
    app._router.stack
      .filter(val => val.route)
      .map(val => `${val.route.stack[0].method.toUpperCase()} ${val.route.path}`)
  )
})

app.get('/me', (req, res) => {
  res.status(200).json(req.session.pokeUser)
})

app.get('/users', (req, res) => {
  res.status(200).json(User.list.map(v => {
    return {
      uuid: v.uuid,
      username: v.username || 'Not logged',
      pokeUser: {
        playerInfo: v.pokeUser.playerInfo,
        profile: v.pokeUser.profile
      }
    }
  }))
})

app.get('/login', (req, res) => {
  let provider = req.query.provider || config.login.provider
  let username = req.query.username  || config.login.username
  let password = req.query.password || config.login.password

  req.session.pokeUser
    .login(provider, username, password)
    .then(() => {
      res.status(200).json({'status': 'valid'})
    })
})

app.get('/getHeartbeat/:coords', (req, res) => {
  let {lat, lon} = Utils.getCoordFromQueryString(req.params.coords)
  req.session.pokeUser
    .setLocation(lat, lon)
    .then(function(location) {
      console.log(user.uuid, location)
      return user.getHeartbeat()
    })
    .then(function(heartbeat) {
      res.json(heartbeat)
    })
    .catch(function(err) {
      console.log('err', err)
      errorIt(res, err)
    })
})
