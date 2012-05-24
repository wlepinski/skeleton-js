define ['subscriber', 'state_machine', 'ext/string'], (Subscriber, StateMachine, StringEx) ->

	'use strict'

	###
	Private Methods
	###

	###
	View Class
	###
	class View extends Backbone.View

		# View should inherit the defaults from Subscriber class
		_(View.prototype).defaults(Subscriber);
		_(View.prototype).defaults(StateMachine);

		#
		# Public Properties
		containerSelector	: null
		autoRender			: false
		states				: {}
		transitions			: {}
		subscriptions		: {}
		disposed			: no

		#
		# Constructor
		constructor: (options = {}) ->
			# console.log "View#constructor", this, options

			@_registeredEvents = {}

			# State machine required properties
			@currentState = 'normal'

			# Call super
			super options

		#
		# Delegate
		delegate: (eventType, selector, handler) ->
			if typeof eventType isnt 'string'
				throw new TypeError "View#delegate: first argument must be a string #{@cid}"

			# Check if the handler is a function
			unless _.isFunction handler
				throw new TypeError "View#delegate: handler should be a function on #{@cid}"

			# Add an event namespace
			eventType += ".delegate.#{@cid}"

			# Bind the handler to the view
			handler = _(handler).bind(this)

      		# Register the handler
			@$el.on eventType, selector, handler

		#
		# Initialize method
		initialize: (options = {}) ->
			# console.log "View#initialize", this, options
			# Call super
			super options

		#
		# Create a new bind on the model/collection
		modelBind: (eventType, handlerFunc) ->
			throw new TypeError 'View#modelBind: eventType should be a string' unless _(eventType).isString()
			throw new TypeError 'View#modelBind: handlerFunc should be a function' unless _(handlerFunc).isFunction()

			model = @model or @collection

			# If the model is null, return
			return unless model

			handlers = @_registeredEvents[eventType] or= []
			return if _(handlers).include handlerFunc

			# Include the handler
			handlers.push handlerFunc

			# Include the listener on the model/collection
			model.on eventType, handlerFunc, @

		#
		# Unbinds a event from the related model
		modelUnbind: (eventType, handlerFunc) ->
			throw new TypeError 'View#modelUnbind: eventType should be a string' unless _(eventType).isString()
			throw new TypeError 'View#modelUnbind: handlerFunc should be a function' unless _(handlerFunc).isFunction()

			model = @model or @collection

			# If the model is null, return
			return unless model

			# Get the handlers from the eventType
			handlers = @_registeredEvents[eventType]

			if handlers
				index = _(handlers).indexOf handlerFunc
				handlers.splice index, 1 if index > -1
				delete @_registeredEvents[type] if handlers.length is 0


			model.off eventType, handlerFunc, @

		#
		# Unbinds all events attached to the model
		modelUnbindAll: () ->
			return unless @_registeredEvents

			model = @model or @collection

			# If the model is null, return
			return unless model

			for own type, handlers of @_registeredEvents
				for handler in handlers
					model.unbind type, handler

			@_registeredEvents = {}

		#
		# Dispose method
		dispose: ->
			# console.log "View#dispose", this
			return if @disposed

			@modelUnbindAll()
			@unsubscribeAllEvents()
			@remove()

			# Mark view as disposed
			@disposed = yes

	View