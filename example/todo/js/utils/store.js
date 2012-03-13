
define(function() {
  var S4, Store, guid;
  S4 = function() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  };
  guid = function() {
    return S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4();
  };
  /*
  	Store
  */
  Store = (function() {

    function Store(name) {
      var store;
      this.name = name;
      store = localStorage.getItem(this.name);
      this.data = (store && JSON.parse(store)) || {};
    }

    Store.prototype.save = function() {
      return localStorage.setItem(this.name, JSON.stringify(this.data));
    };

    Store.prototype.create = function(model) {
      if (model.id != null) model.id = model.attributes.id = guid();
      this.data[model.id] = model;
      this.save();
      return model;
    };

    Store.prototype.update = function(model) {
      this.data[model.id] = model;
      this.save();
      return model;
    };

    Store.prototype.find = function(model) {
      return this.data[model.id];
    };

    Store.prototype.findAll = function() {
      return _.values(this.data);
    };

    Store.prototype.destroy = function(model) {
      delete this.data[model.id];
      this.save();
      return model;
    };

    return Store;

  })();
  return Store;
});
