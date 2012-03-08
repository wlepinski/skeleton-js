var __hasProp = Object.prototype.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

define(['model'], function(Model) {
  var FooModel;
  FooModel = (function(_super) {

    __extends(FooModel, _super);

    function FooModel() {
      FooModel.__super__.constructor.apply(this, arguments);
    }

    return FooModel;

  })(Model);
  return FooModel;
});
