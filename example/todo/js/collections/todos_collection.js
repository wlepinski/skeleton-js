var __hasProp = Object.prototype.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

define(['collection', 'models/todo_model', 'utils/store'], function(Collection, TodoModel, Store) {
  var TodosCollection;
  TodosCollection = (function(_super) {

    __extends(TodosCollection, _super);

    function TodosCollection() {
      TodosCollection.__super__.constructor.apply(this, arguments);
    }

    TodosCollection.prototype.model = TodoModel;

    TodosCollection.prototype.url = 'todos';

    TodosCollection.prototype.localStorage = new Store("todos");

    TodosCollection.prototype.getDone = function() {
      return this.filter(function(todo) {
        return todo.get('done');
      });
    };

    TodosCollection.prototype.getRemaining = function() {
      return this.without.apply(this, this.getDone());
    };

    TodosCollection.prototype.comparator = function(first, second) {
      var firDateCreated, secDateCreated;
      firDateCreated = new Date(first.get('dateCreated')).getTime();
      secDateCreated = new Date(second.get('dateCreated')).getTime();
      if (firDateCreated < secDateCreated) return 1;
      if (firDateCreated === secDateCreated) return 0;
      if (firDateCreated > secDateCreated) return -1;
    };

    return TodosCollection;

  })(Collection);
  return TodosCollection;
});
