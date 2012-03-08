define ->
	
	'use strict'

	EventBus = {}
	
	# inherit default from Backbone.Events
	_(EventBus).defaults Backbone.Events

	EventBus.subscribe = EventBus.on = Backbone.Events.on
	EventBus.unsubscribe = EventBus.off = Backbone.Events.off
	EventBus.publish = EventBus.trigger = Backbone.Events.trigger

	EventBus
	