var __hasProp = Object.prototype.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

define(['view'], function(View) {
  var FooView;
  FooView = (function(_super) {

    __extends(FooView, _super);

    FooView.prototype.className = 'fooView';

    function FooView(options) {
      FooView.__super__.constructor.call(this, options);
    }

    return FooView;

  })(View);
  return FooView;
});
