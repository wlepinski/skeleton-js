
define(function() {
  /*
  	StateMachine Class
  */
  var StateMachine;
  StateMachine = {
    startStateMachine: function(options) {
      this.options = options != null ? options : {};
      this._transitions = {};
      this._states = {};
      this.bindStates();
      this.bindTransitions();
      if (this.options.currentState) this.currentState = options.currentState;
      if (!this.currentState) {
        throw new Error("Provide a currentState for the view " + this.name);
      }
    },
    createState: function(stateName, stateData) {
      return this._states[stateName] = stateData;
    },
    createTransition: function(leaveState, event, data) {
      if (!_.has(this._states, data.enterState)) {
        throw Error("StateMachine#createTransition: Unknown state " + data.enterState);
      }
      if (!_.has(this._transitions, leaveState)) {
        this._transitions[leaveState] = {};
        return this._transitions[leaveState][event] = data;
      }
    },
    bindStates: function() {
      var data, stateData, stateName, _ref;
      if (!this.states) return;
      _ref = this.states;
      for (stateName in _ref) {
        stateData = _ref[stateName];
        data = _.clone(stateData);
        data.onEnter = this.collectMethods(data.onEnter || (data.onEnter = []));
        data.onLeave = this.collectMethods(data.onLeave || (data.onLeave = []));
        this.createState(stateName, data);
      }
    },
    bindTransitions: function() {
      var data, events, leaveState, transitionData, transitionName, _ref;
      if (!this.transitions) return;
      _ref = this.transitions;
      for (leaveState in _ref) {
        events = _ref[leaveState];
        for (transitionName in events) {
          transitionData = events[transitionName];
          data = _.clone(transitionData);
          data.callbacks = this.collectMethods(data.callbacks || (data.callbacks = []));
          this.createTransition(leaveState, transitionName, data);
        }
      }
    },
    transitTo: function(event, silent) {
      var data, extraArgs;
      if (silent == null) silent = false;
      if (!_.has(this._transitions, this.currentState)) return false;
      if (!_.has(this._transitions[this.currentState], event)) return false;
      data = this._transitions[this.currentState][event];
      extraArgs = _.toArray(arguments).slice(3);
      this.doTransition.apply(this, [data, event, silent].concat(extraArgs));
    },
    doTransition: function(data, event, silent) {
      var enterState, extraArgs, leaveState, trigger, triggers, _i, _len;
      if (silent == null) silent = false;
      extraArgs = _.toArray(arguments).slice(3);
      leaveState = this.currentState;
      enterState = data.enterState;
      triggers = data.triggers;
      if (!silent) {
        this.trigger.apply(this, ['leaveState:' + leaveState].concat(extraArgs));
      }
      this.callCallbacks(this._states[leaveState].onLeave, extraArgs);
      if (!silent) {
        this.trigger.apply(this, ['transition', leaveState, enterState].concat(extraArgs));
        if (triggers != null) {
          for (_i = 0, _len = triggers.length; _i < _len; _i++) {
            trigger = triggers[_i];
            this.trigger.apply(this, [trigger].concat(extraArgs));
          }
        }
      }
      this.callCallbacks(data.callbacks, extraArgs);
      if (!silent) {
        this.trigger.apply(this, ['enterState:' + enterState].concat(extraArgs));
      }
      this.toState.apply(this, [enterState].concat(extraArgs));
    },
    callCallbacks: function(callbacks, extraArgs) {
      var callback, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = callbacks.length; _i < _len; _i++) {
        callback = callbacks[_i];
        _results.push(callback.apply(this, extraArgs));
      }
      return _results;
    },
    toState: function(name) {
      var extraArgs, onEnter;
      if (!_.has(this._states, name)) {
        throw new Error("StateMachine#toState: Looks like the state " + name + " is not declared on " + this);
      }
      extraArgs = _.toArray(arguments).slice(1);
      onEnter = this._states[name].onEnter;
      this.callCallbacks(onEnter, extraArgs);
      return this.currentState = name;
    },
    collectMethods: function(methodNames) {
      var method, methodName, methods, _i, _len;
      methods = [];
      for (_i = 0, _len = methodNames.length; _i < _len; _i++) {
        methodName = methodNames[_i];
        method = this[methodName];
        if (!method) {
          throw new Error("Method ' " + methodName + " ' does not exist");
        }
        methods.push(method);
      }
      return methods;
    }
  };
  return StateMachine;
});
