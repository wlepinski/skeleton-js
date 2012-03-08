var __hasProp = Object.prototype.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

define(['controller'], function(Controller) {
  var TestController;
  TestController = (function(_super) {

    __extends(TestController, _super);

    function TestController() {
      TestController.__super__.constructor.call(this, 'test_controller');
    }

    TestController.prototype.foo = function() {
      return this.view = 'hello';
    };

    return TestController;

  })(Controller);
  return TestController;
});
