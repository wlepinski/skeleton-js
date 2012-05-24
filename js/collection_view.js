var __hasProp = Object.prototype.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

define(['view'], function(View) {
  'use strict';
  /*
  		CollectionView Class
  		The CollectionView is a specialization of the base View class which provide a way to render a view
  		that will use a collection in order to render multiple elements based on a item renderer.
  */
  var CollectionView;
  CollectionView = (function(_super) {

    __extends(CollectionView, _super);

    CollectionView.prototype.itemView = null;

    function CollectionView(options) {
      CollectionView.__super__.constructor.call(this, options);
    }

    CollectionView.prototype.initialize = function(options) {
      CollectionView.__super__.initialize.call(this, options);
      return this.subscribeEvents();
    };

    CollectionView.prototype.subscribeEvents = function() {
      this.modelBind('add', _.bind(this.addChild, this));
      this.modelBind('remove', _.bind(this.removeChild, this));
      this.modelBind('reset', _.bind(this.addChildren, this));
    };

    CollectionView.prototype.addChild = function(model, collection, options) {
      var child;
      if (options == null) options = {};
      child = this.createChild(model, options);
      return this.renderChild(child, options);
    };

    CollectionView.prototype.removeChild = function(model, collection, options) {
      var child;
      if (child = this.children[model.cid]) {
        child.dispose();
        return delete this.children[model.cid];
      }
    };

    CollectionView.prototype.addChildren = function(collection, options) {
      var _this = this;
      if (options == null) options = {};
      this.disposeChildren();
      collection.each(function(model) {
        return _this.addChild(model, collection, options);
      });
    };

    CollectionView.prototype.renderChild = function(child, options) {
      var children;
      if (options == null) options = {};
      child.render();
      children = this.$el.children();
      if (options.index !== void 0 && children.length !== 0) {
        this.$el.children().eq(options.index).before(child.el);
      } else {
        this.$el.append(child.el);
      }
      return child;
    };

    CollectionView.prototype.createChild = function(model, options) {
      var child;
      child = new this.itemView({
        model: model
      });
      this.storeView(child);
      return child;
    };

    CollectionView.prototype.storeView = function(viewInstance) {
      this.children || (this.children = {});
      return this.children[viewInstance.model.cid] = viewInstance;
    };

    CollectionView.prototype.disposeChildren = function() {
      if (this.children == null) return;
      _(this.children).each(function(child) {
        return child.dispose();
      });
      return this.children = null;
    };

    CollectionView.prototype.render = function() {
      return this.addChildren(this.collection);
    };

    CollectionView.prototype.dispose = function() {
      return CollectionView.__super__.dispose.call(this);
    };

    return CollectionView;

  })(View);
  return CollectionView;
});
