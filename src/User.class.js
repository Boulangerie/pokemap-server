var Promise = require('es6-promise').Promise;
var uuid = require('uuid');
var PokemonGO = require('../node_modules/pokemon-go-node-api/poke.io.js');

function User(config) {
  this.uuid = uuid.v4();
  this.pokeUser = new PokemonGO.Pokeio();
  this.pokeUser.playerInfo.provider = config.provider;
  this.username = config.username;
  this.password = config.password;
};

User.prototype.login = function login() {
  var user = this.pokeUser;
  var promise = new Promise(function (resolve, reject) {
    user.GetAccessToken(this.username, this.password, function(err) {
      if (err) {
        reject(err);
      }
      user.GetApiEndpoint(function(err) {
        if (err) {
          reject(err);
        }
        resolve(this);
      });
    });
  }.bind(this));
  return promise;
};

User.prototype.setLocation = function setLocation(latitude, longitude) {
  var user = this.pokeUser;
  var promise = new Promise(function (resolve, reject) {
    if (isNaN(latitude) || isNaN(longitude)) {
      reject('latitude or longitude is Invalid');
    }
    var location = {
      'type': 'coords',
      'coords': {
        'latitude': latitude,
        'longitude': longitude,
        'altitude': 0
      }
    };
    user.SetLocation(location, function(err) {
      if (err) {
        reject(err);
      }
      resolve(location.coords)
    });
  });
  return promise;
};

User.prototype.getHeartbeat = function getHeartbeat() {
  var user = this.pokeUser;
  var promise = new Promise(function (resolve, reject) {
    user.Heartbeat(function(err, hr) {
      if (err) {
        reject(err);
      }
      resolve(hr)
    });
  });
  return promise;
};

module.exports = User;
