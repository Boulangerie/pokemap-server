var express = require('express');
var app = express();
var exec = require('child_process').exec;
var cmd = 'python python_vendors/pokecli.py';

app.listen(3000, function () {
  console.log('listening on port 3000!');
});

app.get('/getMapObjects', function (req, res) {
  exec(cmd, function(error, stdout, stderr) {
    res.send(stdout + stderr);
  });
});
