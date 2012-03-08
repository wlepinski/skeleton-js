var __hasProp = Object.prototype.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

define(['subscriber', 'state_machine'], function(Subscriber, StateMachine) {
  'use strict';
  /*
  	View Class
  */
  var View;
  View = (function(_super) {

    __extends(View, _super);

    _(View.prototype).defaults(Subscriber);

    _(View.prototype).defaults(StateMachine);

    View.prototype.dispose = false;

    function View(options) {
      this._registeredCollections = {};
      options || (options = {});
      View.__super__.constructor.call(this, options);
    }

    View.prototype.initialize = function(options) {
      var collection, name, _ref;
      View.__super__.initialize.call(this, options);
      if (_.has(options, 'collections')) {
        _ref = options.collections;
        for (name in _ref) {
          collection = _ref[name];
          this.registerViewCollection(name, collection);
        }
      }
      return this.initializeStateMachine();
    };

    View.prototype.render = function() {};

    View.prototype.getRegisteredCollections = function() {
      return _.values(this._registeredCollections);
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

    View.prototype.initializeStateMachine = function() {};

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
