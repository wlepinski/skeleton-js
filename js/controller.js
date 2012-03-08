
define(function() {
  'use strict';
  /*
  		Controller Class
  */
  var Controller;
  Controller = (function() {

    Controller.prototype.id = void 0;

    Controller.prototype.disposed = false;

    Controller.prototype.currentView = null;

    Controller.prototype._registeredCollections = {};

    Controller.prototype._registeredModels = {};

    function Controller(id) {
      this.id = id;
      if (!(this.id != null)) {
        throw new Error('Controller instances must have an id');
      }
      this.initialize();
    }

    Controller.prototype.initialize = function() {};

    Controller.prototype.registerModel = function(name, model) {
      if (!_.has(this._registeredModels, name)) {
        return this._registeredModels[name] = model;
      }
    };

    Controller.prototype.getModel = function(name) {
      if (!_.has(this._registeredModels, name)) {
        throw new Error("The model with name " + name + " is not registered on the controller " + this.id);
      }
      return this._registeredModels[name];
    };

    Controller.prototype.getModels = function() {
      return _(this._registeredModels).values();
    };

    Controller.prototype.registerCollection = function(name, collection) {
      if (!_.has(this._registeredCollections, name)) {
        return this._registeredCollections[name] = collection;
      }
    };

    Controller.prototype.getCollection = function(name) {
      if (!_.has(this._registeredCollections, name)) {
        throw new Error("The collection with name " + name + " is not registered on the controller " + this.id);
      }
      return this._registeredCollections[name];
    };

    Controller.prototype.getCollections = function() {
      return _(this._registeredCollections).values();
    };

    Controller.prototype.dispose = function() {
      var collection, model, name, _ref, _ref2;
      if (this.disposed) return;
      _ref = this._registeredModels;
      for (name in _ref) {
        model = _ref[name];
        model.dispose();
        delete this._registeredModels[name];
      }
      _ref2 = this._registeredCollections;
      for (name in _ref2) {
        collection = _ref2[name];
        collection.dispose();
        delete this._registeredCollections[name];
      }
      return this.disposed = true;
    };

    return Controller;

  })();
  return Controller;
});
