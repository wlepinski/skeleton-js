var __hasProp = Object.prototype.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

define(['view'], function(View) {
  /*
  		CollectionView Class
  		
  		The CollectionView is a specialization of the base View class which provide a way to render a view
  		that will use a collection in order to render multiple elements based on a item renderer.
  */
  var CollectionView;
  CollectionView = (function(_super) {

    __extends(CollectionView, _super);

    function CollectionView() {
      CollectionView.__super__.constructor.apply(this, arguments);
    }

    CollectionView.prototype.itemRenderer = null;

    return CollectionView;

  })(View);
  return CollectionView;
});
