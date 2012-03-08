
define(function() {
  'use strict';
  var EventBus;
  EventBus = {};
  _(EventBus).defaults(Backbone.Events);
  EventBus.subscribe = EventBus.on = Backbone.Events.on;
  EventBus.unsubscribe = EventBus.off = Backbone.Events.off;
  EventBus.publish = EventBus.trigger = Backbone.Events.trigger;
  return EventBus;
});
