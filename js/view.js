var __hasProp = Object.prototype.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

define(['subscriber', 'state_machine', 'ext/string'], function(Subscriber, StateMachine, StringEx) {
  'use strict';
  /*
  	Private Methods
  */
  /*
  	View Class
  */
  var View;
  View = (function(_super) {

    __extends(View, _super);

    _(View.prototype).defaults(Subscriber);

    _(View.prototype).defaults(StateMachine);

    View.prototype.containerSelector = null;

    View.prototype.autoRender = false;

    View.prototype.states = {};

    View.prototype.transitions = {};

    View.prototype.subscriptions = {};

    View.prototype.disposed = false;

    function View(options) {
      if (options == null) options = {};
      this._registeredEvents = {};
      this.currentState = 'normal';
      View.__super__.constructor.call(this, options);
    }

    View.prototype.delegate = function(eventType, selector, handler) {
      if (typeof eventType !== 'string') {
        throw new TypeError("View#delegate: first argument must be a string " + this.cid);
      }
      if (!_.isFunction(handler)) {
        throw new TypeError("View#delegate: handler should be a function on " + this.cid);
      }
      eventType += ".delegate." + this.cid;
      handler = _(handler).bind(this);
      return this.$el.on(eventType, selector, handler);
    };

    View.prototype.initialize = function(options) {
      if (options == null) options = {};
      return View.__super__.initialize.call(this, options);
    };

    View.prototype.modelBind = function(eventType, handlerFunc) {
      var handlers, model, _base;
      if (!_(eventType).isString()) {
        throw new TypeError('View#modelBind: eventType should be a string');
      }
      if (!_(handlerFunc).isFunction()) {
        throw new TypeError('View#modelBind: handlerFunc should be a function');
      }
      model = this.model || this.collection;
      if (!model) return;
      handlers = (_base = this._registeredEvents)[eventType] || (_base[eventType] = []);
      if (_(handlers).include(handlerFunc)) return;
      handlers.push(handlerFunc);
      return model.on(eventType, handlerFunc, this);
    };

    View.prototype.modelUnbind = function(eventType, handlerFunc) {
      var handlers, index, model;
      if (!_(eventType).isString()) {
        throw new TypeError('View#modelUnbind: eventType should be a string');
      }
      if (!_(handlerFunc).isFunction()) {
        throw new TypeError('View#modelUnbind: handlerFunc should be a function');
      }
      model = this.model || this.collection;
      if (!model) return;
      handlers = this._registeredEvents[eventType];
      if (handlers) {
        index = _(handlers).indexOf(handlerFunc);
        if (index > -1) handlers.splice(index, 1);
        if (handlers.length === 0) delete this._registeredEvents[type];
      }
      return model.off(eventType, handlerFunc, this);
    };

    View.prototype.modelUnbindAll = function() {
      var handler, handlers, model, type, _i, _len, _ref;
      if (!this._registeredEvents) return;
      model = this.model || this.collection;
      if (!model) return;
      _ref = this._registeredEvents;
      for (type in _ref) {
        if (!__hasProp.call(_ref, type)) continue;
        handlers = _ref[type];
        for (_i = 0, _len = handlers.length; _i < _len; _i++) {
          handler = handlers[_i];
          model.unbind(type, handler);
        }
      }
      return this._registeredEvents = {};
    };

    View.prototype.dispose = function() {
      if (this.disposed) return;
      this.modelUnbindAll();
      this.unsubscribeAllEvents();
      this.remove();
      return this.disposed = true;
    };

    return View;

  })(Backbone.View);
  return View;
});
