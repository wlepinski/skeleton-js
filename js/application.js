
define(['eventbus', 'ext/string'], function(EventBus, StringExt) {
  'use strict';
  var Application, onControllerLoaded;
  onControllerLoaded = function(controllerName, action, params, controllerClass) {
    this.disposeCurrentController();
    this.initializeController(controllerName, params, controllerClass);
    return this.callControllerAction(action, params);
  };
  /*
  	Application Class
  */
  Application = (function() {

    _(Application.prototype).defaults(Backbone.Events);

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
      var callback, controllerFileName, isSameAction, isSameController;
      if (action == null) action = 'index';
      if (params == null) params = {};
      isSameController = this.currentControllerName === controllerName;
      if (isSameController) {
        return isSameAction = this.currentAction === action && ((this.currentParams != null) || this.currentParams);
      } else {
        controllerFileName = StringExt.underscorize(controllerName + '_controller');
        callback = _.bind(onControllerLoaded, this);
        return require(['controllers/' + controllerFileName], _(callback).bind(this, controllerName, action, params));
      }
    };

    Application.prototype.disposeCurrentController = function() {
      if (this.currentController) {
        if (!((this.currentController.dispose != null) && _.isFunction(this.currentController.dispose))) {
          throw new Error('Application#onControllerLoaded: A dispose method should be provided on ' + this.currentControllerName);
        }
        this.currentController.dispose();
        this.currentController = null;
        this.currentControllerName = null;
        this.currentView = null;
        this.currentViewParams = null;
        return this.currentParams = null;
      }
    };

    Application.prototype.initializeController = function(controllerName, params, controllerClass) {
      var controller;
      controller = new controllerClass();
      controller.initialize(params);
      this.previousController = this.currentControllerName;
      this.currentControllerName = controllerName;
      this.currentController = controller;
      return this.trigger('Controller.Initialized', controller);
    };

    Application.prototype.callControllerAction = function(action, params) {
      var actionName;
      if (!(this.currentController != null)) {
        throw new Error('You must have an active controller in order to call an specific action');
      }
      actionName = StringExt.camelize(action);
      if (!_.isFunction(this.currentController[action])) {
        throw new Error("Application#callControllerAction: We can't find a method called " + actionName + " on the controller " + this.currentController.id);
      }
      this.currentController[actionName](params);
      this.currentView = this.currentController.view;
      this.currentViewParams = params;
      return this.trigger('Action.Called', this.currentView);
    };

    return Application;

  })();
  return Application;
});
