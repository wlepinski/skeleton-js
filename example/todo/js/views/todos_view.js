var __hasProp = Object.prototype.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

define(['view', 'views/todos_list_view', 'views/todos_stats_view'], function(View, TodosListView, TodosStatsView) {
  'use strict';
  var TodosView;
  TodosView = (function(_super) {

    __extends(TodosView, _super);

    function TodosView() {
      TodosView.__super__.constructor.apply(this, arguments);
    }

    TodosView.prototype.id = 'todos';

    TodosView.prototype.todosListView = null;

    TodosView.prototype.initialize = function(options) {
      TodosView.__super__.initialize.call(this);
      this.subscribeEvent('Todo.Create', this.createTodo);
      this.modelBind('reset', this.render);
      this.todosListView = new TodosListView({
        collection: this.collection
      });
      return this.todosStatsView = new TodosStatsView({
        collection: this.collection
      });
    };

    TodosView.prototype.createTodo = function(todoText) {
      var data;
      data = {
        text: todoText,
        dateCreated: new Date()
      };
      return this.collection.create(data);
    };

    TodosView.prototype.render = function() {
      this.$el.append(this.todosListView.el);
      return this.$el.append(this.todosStatsView.el);
    };

    TodosView.prototype.dispose = function() {
      if (this.todosStatsView != null) this.todosStatsView.dispose();
      if (this.todosListView != null) this.todosListView.dispose();
      return TodosView.__super__.dispose.call(this);
    };

    return TodosView;

  })(View);
  return TodosView;
});
