var Pokeio = require('pokemon-go-node-api/poke.io');
// var express = require('express');
// var app = express();
//
// app.listen(3000, function () {
//   console.log('listening on port 3000!');
// });
//
// app.get('/', function (req, res) {
//   res.send('Hello World!');
// });


//Set environment variables or replace placeholder text
var location = {
  type: 'name',
  name: process.env.PGO_LOCATION || 'Times Square'
};

var username = process.env.PGO_USERNAME || 'Chatnoir33';
var password = process.env.PGO_PASSWORD || 'chatchat';
var provider = process.env.PGO_PROVIDER || 'ptc';

Pokeio.init(username, password, location, provider, function(err) {
  if (err) throw err;
  console.log('[i] Current location: ' + Pokeio.playerInfo.locationName);
  console.log('[i] lat/long/alt: : ' + Pokeio.playerInfo.latitude + ' ' + Pokeio.playerInfo.longitude + ' ' + Pokeio.playerInfo.altitude);

  Pokeio.GetProfile(function(err, profile) {
    if (err) throw err;
    console.log('[i] Username: ' + profile.username);
    console.log('[i] Poke Storage: ' + profile.poke_storage);
    console.log('[i] Item Storage: ' + profile.item_storage);

    var poke = 0;
    if (profile.currency[0].amount) {
      poke = profile.currency[0].amount;
    }

    console.log('[i] Pokecoin: ' + poke);
    console.log('[i] Stardust: ' + profile.currency[1].amount);
  });

  // Pokeio.Heartbeat(function () {
  //   console.log(arguments)
  // });

});
