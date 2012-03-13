var __hasProp = Object.prototype.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

define(['view'], function(View) {
  var FooView;
  FooView = (function(_super) {

    __extends(FooView, _super);

    FooView.prototype.className = 'fooView';

    FooView.prototype.subscriptions = {
      loginEvent: 'onLogin'
    };

    function FooView(options) {
      FooView.__super__.constructor.call(this, options);
    }

    FooView.prototype.onLogin = function(event) {
      return console.log(event);
    };

    return FooView;

  })(View);
  return FooView;
});
