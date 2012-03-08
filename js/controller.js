
define(function() {
  var Controller;
  Controller = (function() {

    Controller.prototype.id = void 0;

    Controller.prototype.view = null;

    function Controller(id) {
      this.id = id;
    }

    Controller.prototype.initialize = function() {};

    return Controller;

  })();
  return Controller;
});
