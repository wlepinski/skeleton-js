var __hasProp = Object.prototype.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

define(['view'], function(View) {
  var StateView;
  StateView = (function(_super) {

    __extends(StateView, _super);

    StateView.prototype.states = {
      normal: {
        onEnter: ['onEnterNormalState'],
        onLeave: ['onLeaveNormalState']
      },
      foo: {
        onEnter: ['onEnterFooState'],
        onLeave: ['onLeaveFooState']
      }
    };

    StateView.prototype.transitions = {
      normal: {
        toFoo: {
          enterState: "foo",
          callbacks: ['otherCallback'],
          triggers: ['fooEvent']
        }
      },
      foo: {
        toNormal: {
          enterState: "normal",
          callbacks: ['otherCallback'],
          triggers: ['fooEvent']
        }
      }
    };

    function StateView(options) {
      this.onEnterNormalState = function() {};
      this.otherCallback = function() {};
      this.onLeaveNormalState = function() {};
      this.onEnterFooState = function() {};
      this.onLeaveFooState = function() {};
      StateView.__super__.constructor.call(this, options);
    }

    return StateView;

  })(View);
  return StateView;
});
