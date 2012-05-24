var __hasProp = Object.prototype.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

define(['collection_view', 'views/todos_list_item_view'], function(CollectionView, TodosListItemView) {
  'use strict';
  var TodosListView;
  TodosListView = (function(_super) {

    __extends(TodosListView, _super);

    function TodosListView() {
      TodosListView.__super__.constructor.apply(this, arguments);
    }

    TodosListView.prototype.itemView = TodosListItemView;

    TodosListView.prototype.tagName = 'ul';

    TodosListView.prototype.id = 'todo-list';

    return TodosListView;

  })(CollectionView);
  return TodosListView;
});
