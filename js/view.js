var __hasProp = Object.prototype.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

define(['subscriber', 'state_machine', 'ext/string'], function(Subscriber, StateMachine, StringEx) {
  'use strict';
  /*
  	Private Methods
  */
  var View, wrapMethods;
  wrapMethods = function(methodNames) {
    var instance, name, wrapMethod, _i, _len, _results;
    instance = this;
    wrapMethod = function(methodName) {
      var func;
      func = instance[methodName];
      return instance[methodName] = function() {
        var beforeRet,
          _this = this;
        beforeRet = instance["before" + (StringEx.upcase(methodName))].apply(instance, arguments);
        if ((beforeRet != null) && _.has(beforeRet, 'done')) {
          beforeRet.done(function() {
            func.apply(instance, arguments);
            return instance["after" + (StringEx.upcase(methodName))].apply(instance, arguments);
          });
        } else {
          func.apply(this, arguments);
          instance["after" + (StringEx.upcase(methodName))].apply(instance, arguments);
        }
        return func;
      };
    };
    _results = [];
    for (_i = 0, _len = methodNames.length; _i < _len; _i++) {
      name = methodNames[_i];
      _results.push(wrapMethod(name));
    }
    return _results;
  };
  /*
  	View Class
  */
  View = (function(_super) {

    __extends(View, _super);

    _(View.prototype).defaults(Subscriber);

    _(View.prototype).defaults(StateMachine);

    View.prototype.dispose = false;

    View.prototype.containerSelector = null;

    View.prototype.autoRender = false;

    View.prototype.states = {};

    View.prototype.transitions = {};

    View.prototype.subscriptions = {};

    function View(options) {
      if (options == null) options = {};
      this._registeredCollections = {};
      this.currentState = 'normal';
      wrapMethods.apply(this, [['render', 'initialize']]);
      View.__super__.constructor.call(this, options);
    }

    View.prototype.initialize = function(options) {
      if (options == null) options = {};
      return View.__super__.initialize.call(this, options);
    };

    View.prototype.render = function() {};

    View.prototype.beforeRender = function() {
      var calls, collection, _i, _len, _ref;
      calls = [];
      _ref = this.getRegisteredCollections();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        collection = _ref[_i];
        calls.push(collection.fetch());
      }
      return $.when.apply(this, calls);
    };

    View.prototype.afterRender = function() {
      if (this.containerSelector != null) {
        return this.containerSelector.empty().append(this.$el);
      }
    };

    View.prototype.beforeInitialize = function(options) {
      var collection, method, name, subscription, _ref, _ref2, _results;
      _ref = this.subscriptions;
      for (subscription in _ref) {
        method = _ref[subscription];
        if (!_.isFunction(this[method])) {
          throw new Error("The method " + method + " does not exist " + this.cid);
        }
        this.subscribeEvent(subscription, this[method]);
      }
      if (options && (options.containerSelector != null)) {
        if (_.isString(options.containerSelector)) {
          this.containerSelector = $(options.containerSelector);
        }
      }
      if (_.has(options, 'collections')) {
        _ref2 = options.collections;
        _results = [];
        for (name in _ref2) {
          collection = _ref2[name];
          _results.push(this.registerViewCollection(name, collection));
        }
        return _results;
      }
    };

    View.prototype.afterInitialize = function(options) {
      var byDefault, byOption;
      this.startStateMachine();
      if (!this.containerSelector) return;
      byOption = options && options.autoRender === true;
      byDefault = this.autoRender && !byOption;
      if (byOption || byDefault) return this.render();
    };

    View.prototype.getRegisteredCollections = function() {
      return _(this._registeredCollections).values();
    };

    View.prototype.getRegisteredCollection = function(name) {
      if (_.has(this._registeredCollections, name)) {
        return this._registeredCollections[name];
      }
      return null;
    };

    View.prototype.registerViewCollection = function(name, collection) {
      if (!_.has(this._registeredCollections, name)) {
        return this._registeredCollections[name] = collection;
      }
    };

    View.prototype.unregisterViewCollection = function(name) {
      var collection;
      if (!_.has(this._registeredCollections, name)) {
        throw new Error("View#unregisterViewCollection: The collection with name " + name + " sent is not registered on this view");
      }
      collection = this._registeredCollections[name];
      collection.dispose();
      return delete this._registeredCollections[name];
    };

    View.prototype.unregisterViewAllCollections = function() {
      var name, _i, _len, _ref, _results;
      _ref = _.keys(this._registeredCollections);
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        name = _ref[_i];
        _results.push(this.unregisterViewCollection(name));
      }
      return _results;
    };

    View.prototype.modelBind = function(eventType, handlerFunc, model) {
      if (model == null) return model = this.model || this.collection;
    };

    View.prototype.modelUnbind = function(eventType, handlerFunc, model) {
      if (model == null) return model = this.model || this.collection;
    };

    View.prototype.dispose = function() {
      this.unregisterViewAllCollections();
      this.unsubscribeAllEvents();
      return this.disposed = true;
    };

    return View;

  })(Backbone.View);
  return View;
});
