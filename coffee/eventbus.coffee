define ->
	
	'use strict'

	EventBus = {}
	
	# inherit defaults from Backbone.Events
	_(EventBus).defaults Backbone.Events

	# Create some aliases
	EventBus.subscribe = EventBus.on = Backbone.Events.on
	EventBus.unsubscribe = EventBus.off = Backbone.Events.off
	EventBus.publish = EventBus.trigger = Backbone.Events.trigger

	# Define some properties to be read-only
	if _.isFunction Object.defineProperties
        readOnlyProperty = {
            writable: false
        }

        properties =
            subscribe: readOnlyProperty
            unsubscribe: readOnlyProperty
            publish: readOnlyProperty

        Object.defineProperties EventBus, properties

    # Seal the object
	#if _.isFunction Object.seal
    #	Object.seal EventBus

	EventBus