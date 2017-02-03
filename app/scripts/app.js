import 'babel-polyfill';
import $ from 'jquery';

var cats = require('./controllers/cats');

$(document).on('ready', function () {
  cats();
});
