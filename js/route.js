var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = Object.prototype.hasOwnProperty;

define(['eventbus'], function(EventBus) {
  'use strict';
  /*
  	Route Class
  */
  var Route;
  Route = (function() {

    Route.prototype.paramNames = [];

    function Route(pattern, controller, action, constraints, params) {
      this.pattern = pattern;
      this.controller = controller;
      this.action = action != null ? action : 'index';
      this.constraints = constraints != null ? constraints : {};
      this.params = params != null ? params : {};
      this.addParamName = __bind(this.addParamName, this);
      if (this.controller == null) throw new Error('A controller must be defined');
      this.handler = _.bind(this.handler, this);
      this.paramNames = [];
      pattern = pattern.replace(/:(\w+)/g, this.addParamName);
      this.regExp = RegExp("^" + pattern + "(?=\\?|$)");
    }

    Route.prototype.handler = function(path) {
      var params;
      params = this.buildParams(path);
      return EventBus.publish('Route.Matched', this, params);
    };

    Route.prototype.buildParams = function(path, options) {
      var params;
      params = this.extractParams(path);
      _(params).extend(this.params);
      params.changeURL = Boolean(options && options.changeURL);
      params.path = path;
      return params;
    };

    Route.prototype.addParamName = function(match, paramName) {
      this.paramNames.push(paramName);
      return '([\\w-]+)';
    };

    Route.prototype.test = function(path) {
      var constraint, matched, name, params, _ref;
      matched = this.regExp.test(path);
      if (!matched) return false;
      if (_(this.constraints).keys().length > 0) {
        params = this.extractParams(path);
        _ref = this.constraints;
        for (name in _ref) {
          if (!__hasProp.call(_ref, name)) continue;
          constraint = _ref[name];
          if (!constraint.test(params[name])) return false;
        }
      }
      return true;
    };

    Route.prototype.extractParams = function(path) {
      var index, match, matches, paramName, params, _len, _ref;
      params = {};
      matches = this.regExp.exec(path);
      _ref = matches.slice(1);
      for (index = 0, _len = _ref.length; index < _len; index++) {
        match = _ref[index];
        paramName = this.paramNames[index];
        params[paramName] = match;
      }
      return params;
    };

    return Route;

  })();
  return Route;
});
