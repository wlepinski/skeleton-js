define ['subscriber', 'state_machine'], (Subscriber, StateMachine) ->

	'use strict'

	###
	View Class
	###
	class View extends Backbone.View

		# View should inherit the defaults from Subscriber class
		_(View.prototype).defaults(Subscriber);
		_(View.prototype).defaults(StateMachine);

		#
		# Public Properties
		dispose: false

		#
		# Constructor
		constructor: (options) ->
			#
			# Private Properties
			@_registeredCollections = {}

			options or= {}

			# Call super
			super options

		#
		# Initialize method
		initialize: (options) ->
			# Call super
			super options

			# Verify is the collections property is set on options object
			if _.has(options, 'collections')
				for name, collection of options.collections
					@registerViewCollection name, collection

			@initializeStateMachine()

		render: ->

		#
		# Return all registered collections
		getRegisteredCollections: ->
			return _.values( @_registeredCollections );
		
		#
		# Return a collection by it's name
		getRegisteredCollection: (name) ->
			if _.has(@_registeredCollections, name)
				return @_registeredCollections[name];

			return null

		#
		# Register a collection that will be used on the view.
		#
		# All collections registered using this method will be automatic disposed on view's dispose.
		# If a collection is already registered, nothing happens
		#
		# @param collection The collection to be registered
		registerViewCollection: (name, collection) ->
			unless _.has( @_registeredCollections, name )
				@_registeredCollections[name] = collection
			
		#
		# Unregister a given collection.
		#
		# @param collection The collection to be unregistered
		unregisterViewCollection: (name) ->
			unless _.has(@_registeredCollections, name)
				throw new Error("View#unregisterViewCollection: The collection with name #{ name } sent is not registered on this view")
			
			collection = @_registeredCollections[name]
			collection.dispose()

			# Remove the collection from the array and dispose it
			delete @_registeredCollections[name]
		
		#
		# Unregister all collections registered on this view.
		# Check the method unregisterViewCollection for more details
		unregisterViewAllCollections: ->
			for name in _.keys( @_registeredCollections )
				@unregisterViewCollection name

		#
		# Initialize the StateMachine
		initializeStateMachine: ->

		#
		# Adds a new event to the related model
		modelBind: (eventType, handlerFunc, model) ->
			unless model?
				model = @model or @collection
		#
		# Unbinds a event from the related model
		modelUnbind: (eventType, handlerFunc, model) ->
			unless model?
				model = @model or @collection

		#
		# Dispose method
		dispose: ->
			@unregisterViewAllCollections()
			@unsubscribeAllEvents()

			@disposed = yes

			
	View