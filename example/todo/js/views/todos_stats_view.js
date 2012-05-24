var __hasProp = Object.prototype.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

define(['view'], function(View) {
  var TodosStatsView;
  TodosStatsView = (function(_super) {

    __extends(TodosStatsView, _super);

    function TodosStatsView() {
      TodosStatsView.__super__.constructor.apply(this, arguments);
    }

    TodosStatsView.prototype.id = 'todo-stats';

    TodosStatsView.prototype.template = _("<% if (done) { %>\n	<a href=\"#\" id=\"clear-completed\">Clear all <%= done %> completed <%= done == 1 ? 'item' : 'items' %></a>\n<% } %>\n<div class=\"todo-count\"><b><%= remaining %></b> <%= remaining == 1 ? 'item' : 'items' %> left</div>").template();

    TodosStatsView.prototype.initialize = function(options) {
      TodosStatsView.__super__.initialize.call(this, options);
      this.modelBind('change:done', this.render);
      this.modelBind('add', this.render);
      this.modelBind('remove', this.render);
      this.modelBind('reset', this.render);
      return this.delegate('click', 'a#clear-completed', this.clearCompleted);
    };

    TodosStatsView.prototype.clearCompleted = function(event) {
      _.each(this.collection.getDone(), function(todo) {
        return todo.destroy();
      });
      return event.preventDefault();
    };

    TodosStatsView.prototype.render = function() {
      var done, remaining;
      done = this.collection.getDone().length;
      remaining = this.collection.getRemaining().length;
      return this.$el.html(this.template({
        done: done,
        remaining: remaining
      }));
    };

    return TodosStatsView;

  })(View);
  return TodosStatsView;
});
