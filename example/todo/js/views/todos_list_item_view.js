var __hasProp = Object.prototype.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

define(['item_view'], function(ItemView) {
  var TodosListItemView;
  TodosListItemView = (function(_super) {

    __extends(TodosListItemView, _super);

    function TodosListItemView() {
      TodosListItemView.__super__.constructor.apply(this, arguments);
    }

    TodosListItemView.prototype.tagName = 'li';

    TodosListItemView.prototype.template = _("<% dateCreated = new Date(dateCreated); %>\n<div class=\"<%= (done) ? 'view done' : 'view' %>\">\n	<input <%= (done) ? 'checked' : '' %> title=\"Check as done\" class=\"toggle\" type=\"checkbox\" />\n	<span><%=text%>\n		<small>\n			<%=dateCreated.getDate()%> /\n			<%=dateCreated.getMonth()+1%> /\n			<%=dateCreated.getFullYear()%>\n		</small>\n	</span>\n\n	<a href=\"#\" class=\"destroy\"></a>\n</div>\n<input class=\"edit-input\" type=\"text\" value=\"<%=text%>\">").template();

    TodosListItemView.prototype.initialize = function(options) {
      TodosListItemView.__super__.initialize.apply(this, arguments);
      this.modelBind('change', this.render);
      this.delegate('click', 'a.destroy', this.onDestroy);
      this.delegate('dblclick', 'div', this.onDblClick);
      this.delegate('click', 'input.toggle', this.toggleTodo);
      this.delegate('blur', 'input.edit-input', this.onEditBlur);
      return this.delegate('keypress', 'input.edit-input', this.onEditKeyPress);
    };

    TodosListItemView.prototype.toggleTodo = function(event) {
      var isDone;
      isDone = $(event.target).is(':checked');
      this.model.set('done', isDone);
      return this.model.save();
    };

    TodosListItemView.prototype.onEditKeyPress = function(event) {
      if (event.keyCode !== 13) return;
      this.model.set('text', $(event.target).val());
      return this.model.save();
    };

    TodosListItemView.prototype.onEditBlur = function(event) {
      return this.$el.removeClass('editing');
    };

    TodosListItemView.prototype.onDblClick = function(event) {
      this.$el.addClass('editing');
      return this.$el.find('input.edit-input').focus();
    };

    TodosListItemView.prototype.onDestroy = function(event) {
      return this.model.destroy();
    };

    return TodosListItemView;

  })(ItemView);
  return TodosListItemView;
});
