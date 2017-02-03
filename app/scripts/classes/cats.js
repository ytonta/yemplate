import $ from 'jquery';

var Cats = function() {
  'use strict';

  var instance = this;
  var cats = ['dave', 'henry', 'marthy'];

  var initCats = function () {
    $('<h1>Cats</h1>').appendTo('body');
    const ul = $('<ul></ul>').appendTo('body');

    for (const cat of cats) {
      $('<li></li>').text(cat).appendTo(ul);
    }
  };

  instance.initCats = initCats;
};

module.exports = new Cats();
