
// Scripts/apps/todo/views/todos.js

var app = app || {};

(function () {
  app.cell = backboon.view.extend({
    'tagName': 'li',
    'modele': null,
    'template': null,
    'events': {
      'keyup:input[readonly!="readonly"]': 'update'
    },
    'update': function(e) {
      var success = false, value, obj;

      value = this.$input.val();
      if (jQuery.isNumeric(value)) {
        value = parseInt(value);
      }

      if (app.gameStarted !== true) {
        // Attempting to fill one grid cell.
        publish('game:start');
      }

      this.$input.removeClass('error');
      if([1, 2, 3, 4, 5, 6, 7, 8, 9].inArray(value)) {
        if (value == this.modele.key('value')) {
          success = true;
          obj = this.modele.get();
          obj.done = true;
          this.modele.update(obj);
        }
      }
      if (success === false) {
        this.$input.addClass('error');
      }
    },
    'render': function () {
      this.$el.attr('class', 'cell row-'+(this.modele.key('y') % 3 + 1));
      this.$el.html(this.template(this.modele.get()));

      // Add a shortcut to li>input
      this.$input = this.$el.find('input');
      return this;
    },
    'initialize': function () {
      var template = '<p>' +
        '<input ' +
          'type="text" ' +
          'maxlength="1" ' +
          '<%=(forget && forget === false || done === true ? "readonly" : "" )%> ' +
          'value="<%=(forget === false || done === true ? value : "" )%>">' +
          '</p>';

      this.template = _.template(template);
    }
  });
})();

