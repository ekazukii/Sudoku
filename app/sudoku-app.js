
// Scripts/sudoku-app.js

var app = app || {};

(function(){
  app.modele = backboon.modele.extend({
    'gameStarted' : false,
    'defaults': {
      'x': 0,
      'y': 0,
      'value': 0,
      'forget': false,
      'done': false
    },
    'initialize': function() {
       //console.log('New Modele initialized');
    }
  });
})();

new app.main();

