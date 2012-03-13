var __hasProp = Object.prototype.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

define(['controller', 'collections/todos_collection', 'views/todos_view', 'models/todo_model'], function(Controller, TodosCollection, TodosView, TodoModel) {
  /*
  	TodoController
  */
  var TodoController;
  TodoController = (function(_super) {

    __extends(TodoController, _super);

    function TodoController() {
      TodoController.__super__.constructor.call(this, 'todo');
    }

    TodoController.prototype.index = function() {
      this.collection = new TodosCollection();
      this.collection.fetch({
        success: function(data) {
          return console.log(data);
        }
      });
      return this.view = new TodosView({
        collection: this.collection
      });
    };

    return TodoController;

  })(Controller);
  return TodoController;
});
