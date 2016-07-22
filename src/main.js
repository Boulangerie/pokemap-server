var express = require('express');
var config = require('./config.json');
var User = require('./User.class.js');
console.log(User)

var app = express();
app.set('json spaces', 2)
var user = new User(config);
var loginPromise;

app.listen(3000, function () {
  console.log('listening on port 3000!');
  loginPromise = user.login();
});

app.get('/getHeartbeat/:coords', function (request, response) {
  var latitude = parseFloat(request.params.coords.split(',')[0], 10);
  var longitude = parseFloat(request.params.coords.split(',')[1], 10);
  user
    .setLocation(latitude, longitude)
    .then(function(location) {
      console.log(user.uuid, location);
      return user.getHeartbeat();
    })
    .then(function(res) {
      response.json(res);
    })
    .catch(function(err) {
      response.json({'error': err});
    });
});
