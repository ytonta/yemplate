var express = require('express');
var app = express.Router();

app.get('/', function(req, res) {
  res.render('pages/index');
});

app.get('/404', function(req, res) {
  res.render('pages/error');
});

module.exports = app;
