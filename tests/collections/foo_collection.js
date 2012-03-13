var __hasProp = Object.prototype.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

define(['collection'], function(Collection) {
  var FooCollection;
  FooCollection = (function(_super) {

    __extends(FooCollection, _super);

    function FooCollection() {
      FooCollection.__super__.constructor.apply(this, arguments);
    }

    FooCollection.prototype.url = 'foo.xml';

    return FooCollection;

  })(Collection);
  return FooCollection;
});
