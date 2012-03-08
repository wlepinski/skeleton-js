
define(['eventbus', 'ext/string'], function(EventBus, StringExt) {
  'use strict';
  /*
  	Application Class
  */
  var Application;
  return Application = (function() {

    Application.prototype.siteTitle = 'Application';

    Application.prototype.currentParams = null;

    Application.prototype.currentControllerName = null;

    Application.prototype.currentView = null;

    Application.prototype.currentViewParams = null;

    Application.prototype.previousController = null;

    function Application(name) {
      this.name = name;
      if (!(this.name != null)) {
        throw new Error('Every application must have a name');
      }
      this.initializeControllers();
      this.initializeEvents();
      return;
    }

    _(Application.prototype).defaults(Backbone.Events);

    Application.prototype.initializeEvents = function() {
      var _this = this;
      return EventBus.subscribe('Route.Matched', function(route, params) {
        var action, controllerName;
        controllerName = route.controller;
        action = route.action;
        return _this.initializeControllerAndAction(controllerName, action, params);
      });
    };

    Application.prototype.initializeControllers = function() {};

    Application.prototype.initializeControllerAndAction = function(controllerName, action, params) {
      var controllerFileName, isSameAction, isSameController;
      if (action == null) action = 'index';
      if (params == null) params = {};
      isSameController = this.currentControllerName === controllerName;
      if (isSameController) {
        return isSameAction = this.currentAction === action && ((this.currentParams != null) || this.currentParams);
      } else {
        controllerFileName = StringExt.underscorize(controllerName + '_controller');
        return require(['controllers/' + controllerFileName], _(this.onControllerLoaded).bind(this, controllerName, action, params));
      }
    };

    Application.prototype.onControllerLoaded = function(controllerName, action, params, controllerClass) {
      this.disposeCurrentController;
      this.initializeController(controllerName, params, controllerClass);
      return this.callControllerAction(action, params);
    };

    Application.prototype.disposeCurrentController = function() {
      if (this.currentController) {
        if ((this.currentController.dispose != null) && _.isFunction(this.currentController.dispose)) {
          throw new Error('Application#onControllerLoaded: A dispose method should be provided on ' + controllerName);
        }
        return this.currentController.dispose();
      }
    };

    Application.prototype.initializeController = function(controllerName, params, controllerClass) {
      var controller;
      controller = new controllerClass();
      controller.initialize(params);
      this.previousController = this.currentControllerName;
      this.currentControllerName = controllerName;
      this.currentController = controller;
      return this.trigger('Controller.Initialized');
    };

    Application.prototype.callControllerAction = function(action, params) {
      var actionName;
      if (!(this.currentController != null)) {
        throw new Error('You must have an active controller in order to call an specific action');
      }
      actionName = StringExt.camelize(action);
      if (typeof this.currentController[action] !== 'function') {
        throw new Error("ApplicationView#callControllerAction: We can't find a method called " + actionName + " on the controller " + this.currentController.id);
      }
      this.currentController[actionName](params);
      this.currentView = this.currentController.view;
      this.currentViewParams = params;
      return this.trigger('Action.Called');
    };

    return Application;

  })();
});
