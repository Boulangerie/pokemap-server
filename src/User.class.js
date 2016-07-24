var Promise = require('es6-promise').Promise
var UUID = require('uuid')
var PokemonGO = require('../node_modules/pokemon-go-node-api/poke.io.js')

var userList = []

class User {
  static get list () {
    return userList;
  }
  static addUser () {
    let user = new User()
    User.list.push(user)
    return user
  }

  constructor (uuid = UUID.v4()) {
    this.uuid = uuid
    this.pokeUser = new PokemonGO.Pokeio()
  }

  set provider (provider) {
    this.pokeUser.playerInfo.provider = provider
  }
  get provider () {
    return this.pokeUser.playerInfo.provider
  }

  login (provider = this.provider, username = this.username, password = this.password) {
    this.provider = provider
    this.username = username
    this.password = password

    if (this.pokeUser.playerInfo.accessToken) {
      return Promise.resolve(this)
    }

    return new Promise((resolve, reject) => {
      this.pokeUser.GetAccessToken(this.username, this.password, (err) => {
        err && reject(err)
        this.pokeUser.GetApiEndpoint((err) => {
          err && reject(err)
          this.pokeUser.GetProfile((err, profile) => {
            this.pokeUser._profile = profile
            resolve(this)
          })
        })
      })
    })
  }

  setLocation (lat, lon) {
    return new Promise((res, reject) => {
      if (isNaN(lat) || isNaN(lon)) {
        reject('Latitude or longitude are invalid')
      }
      let location = {
        'type': 'coords',
        'coords': {
          'latitude': lat,
          'longitude': lon,
          'altitude': 0
        }
      }
      this.pokeUser.SetLocation(location, (err) => {
        err && reject(err)
        res(location.coords)
      })
    })
  }

  getHeartbeat () {
    return new Promise((resolve, reject) => {
      this.pokeUser.Heartbeat((err, hr) => {
        err && reject(err)
        resolve(hr)
      })
    })
  }
}

User.PROVIDER = {
  GOOGLE: 'google',
  PTC: 'ptc'
}

module.exports = User
