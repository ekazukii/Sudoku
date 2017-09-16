
// Scripts/sudoku-view.js

var app = app || {};

(function () {
  app.main = backboon.view.extend({
    'tmp': [],
    'time': 0,
    'timeoutId': null,
    'gameStarted' : false,
    'el': '#sudoku',
    'events': {
      //'keypress:[name="item"]': 'add'
    },
    'render': function() {
      var cells, element, remaining;
      // The entire collection
      cells = app.collection.all();
      // Found
      remaining = app.collection.where({
        'forget': true,
        'done': false
      }).length;
      this.$remaining.text(remaining);
      if(remaining === 0) {
        this.stopTimer();
      }

      // Renders the grid.
      this.$list.empty();
      if(cells.length) {
        _.each(cells, this.renderOne, this);
      }
    },
    'renderOne': function(modele) {
      var view = new app.cell({'modele': modele});
      this.$list.append(view.render().$el);
    },
    'populate': function(grid) {
      var x=0, g, modele, modeles=[];
      for(x=0; x<grid.length; x++) {
        g = grid[x];
        modele = new app.modele({'modele': {
          'x': g.x,
          'y': g.y,
          'value': g.value,
          'done': g.forget === false ? true : false,
          'forget': g.forget,
        }});
        modeles.push(modele);
      }
      app.collection.add(modeles);
    },
    'setTime': function() {
      var res, d, min, sec, hour, stringTime;
      this.time += 1000;
      d = new Date(this.time);
      // Format hours.
      hour = d.getHours() - 1;
      hour = (hour < 10 ? '0' + hour : hour);
      // Format minutes.
      min = d.getMinutes();
      min = (min < 10 ? '0' + min : min);
      // Format seconds.
      sec = d.getSeconds();
      sec = (sec < 10 ? '0' + sec : sec);
      stringTime = hour + ':' + min + ':' + sec;

      this.$timer.text(stringTime);
      this.$timer.attr('datetime', stringTime);
    },
    'stopTimer': function() {
      return window.clearTimeout(this.timeoutId);
    },
    'startTimer': function() {
      var module = this;
      app.gameStarted = true;
      if(this.timeoutId === null) {
        this.timeoutId = window.setInterval(module.setTime.bind(module), 1000);
      }
    },
    'initialize': function () {

      // Elements
      this.$remaining = $('.remaining');
      this.$timer     = $('.time time');
      this.$list      = $('#grid');

      // Subscriptions
      subscribe('collection:add', this.render, this);
      subscribe('modele:update', this.render, this);
      subscribe('game:start', this.startTimer, this);

      // Generate a grid.
      var sudoku, grid;
      sudoku = new Sudoku();
      sudoku.generate();

      // Forget 30% of the grid
      grid = sudoku.forget(0.30);

      if (grid) {
        this.populate(grid);
      }
    }
  });
})();

