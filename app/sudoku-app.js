
// Scripts/sudoku-app.js

var app = app || {};

(function(){
  app.modele = backboon.modele.extend({
    'gameStarted' : false,
    'gameEnded' : false,
    'defaults': {
      'x': 0,
      'y': 0,
      'value': 0,
      'forget': false,
      'done': false
    },
    'startGame': function() {
      this.gameStarted = true;
      this.gameEnded = false;
    },
    'endGame': function() {
      this.gameStarted = false;
      this.gameEnded = true;
    },
    'initialize': function() {
      subscribe('game:start', this.startGame, this);
      subscribe('game:end', this.endGame, this);
    }
  });
})();

new app.main();

