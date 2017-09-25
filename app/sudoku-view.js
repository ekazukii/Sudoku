
// Scripts/sudoku-view.js

var app = app || {};

(function () {
  app.main = backboon.view.extend({
    'tmp': [],
    'time': 0,
    'difficulty': 0.30,
    'timeoutId': null,
    'el': '#sudoku',
    'events': {
      'click:[name="difficulty"]': 'populate'
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
      if (remaining === 0) {
        publish('game:end');
      }

      // Renders the grid.
      this.$grid.empty();
      if(cells.length) {
        _.each(cells, this.renderOne, this);
      }
    },
    'renderOne': function(modele) {
      var view = new app.cell({'modele': modele});
      this.$grid.append(view.render().$el);
    },
    'fill': function(grid) {
      var x=0, g, modele, modeles=[];
      for(x=0; x < grid.length; x++) {
        g = grid[x];
        modele = new app.modele({'modele': {
          'x'      : g.x,
          'y'      : g.y,
          'value'  : g.value,
          'done'   : g.forget === false ? true : false,
          'forget' : g.forget,
        }});
        modeles.push(modele);
      }
      app.collection.clear();
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
    'endGame': function () {
      this.stopTimer();
      this.$success.show();
      this.$scores.show();
    },
    'startGame': function() {
      this.startTimer();
      $('[name="difficulty"]', this.$options).attr('disabled', true);
    },
    'showElement': function(element) {
      $(element).hide();
    },
    'hideElement': function(element) {
      $(element).show();
    },
    'populate': function(element) {
      if (element) {
        this.difficulty = parseFloat($(element).filter(':checked').val());
      }
      var sudoku, grid;
      sudoku = new Sudoku();
      sudoku.generate();

      grid = sudoku.forget(this.difficulty);

      if (grid) {
        this.fill(grid);
      }
    },
    'initialize': function () {

      // Elements
      this.$remaining = $('.remaining');
      this.$timer     = $('.time time');
      this.$grid      = $('#app-grid');
      this.$options   = $('#app-options');
      this.$success   = $('#app-success');
      this.$scores    = $('#app-scores');

      // Subscriptions
      subscribe('collection:add', this.render, this);
      subscribe('modele:update', this.render, this);
      subscribe('game:start', this.startGame, this);
      subscribe('game:end', this.endGame, this);

      this.$success.hide();
      this.$scores.hide();
      //this.$grid.hide();
      //this.$timer.hide();
      this.$options.show();

      this.populate();
    }
  });
})();

