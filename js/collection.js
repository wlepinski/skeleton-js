var __hasProp = Object.prototype.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

define(function() {
  'use strict';
  /*
  	Collection Class
  */
  var Collection;
  Collection = (function(_super) {

    __extends(Collection, _super);

    Collection.prototype.disposed = false;

    function Collection() {
      Collection.__super__.constructor.apply(this, arguments);
      this.initialize();
    }

    Collection.prototype.initialize = function() {};

    Collection.prototype.dispose = function() {};

    return Collection;

  })(Backbone.Collection);
  return Collection;
});
