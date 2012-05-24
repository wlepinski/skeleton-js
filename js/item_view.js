var __hasProp = Object.prototype.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

define(['view'], function(View) {
  var ItemView;
  ItemView = (function(_super) {

    __extends(ItemView, _super);

    function ItemView() {
      ItemView.__super__.constructor.apply(this, arguments);
    }

    ItemView.prototype.template = null;

    ItemView.prototype.render = function() {
      return this.$el.html(this.template(this.model.toJSON()));
    };

    ItemView.prototype.dispose = function() {
      return this.remove();
    };

    return ItemView;

  })(View);
  return ItemView;
});
