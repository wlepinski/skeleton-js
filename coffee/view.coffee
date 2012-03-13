define ['subscriber', 'state_machine', 'ext/string'], (Subscriber, StateMachine, StringEx) ->

	'use strict'

	###
	Private Methods
	###

	#
	# Wrap method with an before[methodName] and after[methodName]
	wrapMethods = (methodNames) ->
		instance = @
		# Inner function that encapsulate the original method with after and before methods
		wrapMethod = (methodName) ->
			func = instance[methodName]
			return instance[methodName] = ->
				# Call the before[methodName] method
				beforeRet = instance["before#{StringEx.upcase(methodName)}"].apply instance, arguments

				# Here we verify if the object returned has the method done, if so, we'r talking about a 
				# object implementing the deferred object of jQuery. What we need here is defer the execution
				# of the executing of the method and their after[method] counterpart right after the deferred 
				# object is resolved.
				if beforeRet? and _.has beforeRet, 'done'
					# Wait until the deferred is resolved
					beforeRet.done () =>
						# Call the original method
						func.apply instance, arguments
						# Call after[methodName] method
						instance["after#{StringEx.upcase(methodName)}"].apply instance, arguments
				# if the object doesnt return anything, just call the methods
				else
					# Call the original method
					func.apply @, arguments
					# Call after[methodName] method
					instance["after#{StringEx.upcase(methodName)}"].apply instance, arguments
				
				return func
		
		# Use the inner function to wrap the method names passed as arguments
		wrapMethod name for name in methodNames

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
		containerSelector: null
		autoRender: false	
		states: {}
		transitions: {}
		subscriptions: {}
		
		#
		# Constructor
		constructor: (options = {}) ->
			@_registeredCollections = {}

			# State machine required properties
			@currentState = 'normal'

			# Wrap render and initialize method with some before and after callbacks
			wrapMethods.apply this, [['render', 'initialize']]

			# Call super
			super options

		#
		# Initialize method
		initialize: (options={}) ->
			# Call super
			super options

		#
		# Render the view.
		render: () ->
			#console.log 'render'

		#
		# This method is called before the method render.
		beforeRender: () ->
			#console.log 'beforeRender'
			calls = []

			for collection in @getRegisteredCollections()
				calls.push collection.fetch()

			return $.when.apply(@, calls)

		#
		# This method is called after the method render.
		afterRender: () ->
			#console.log 'afterRender'
			if @containerSelector?
				@containerSelector.empty().append(@$el)

		#
		# This method is called before the method initialize.
		beforeInitialize: (options) ->
			#console.log 'beforeInitialize'
			for subscription, method of @subscriptions
				unless _.isFunction @[method]
					throw new Error("The method #{method} does not exist #{@cid}")
				@subscribeEvent subscription, @[method]

			# Verify if the have a option called containerSelector and, if so, find the DOM object
			if options and options.containerSelector?
				if _.isString options.containerSelector
					@containerSelector = $(options.containerSelector)

			# Verify is the collections property is set on options object
			if _.has(options, 'collections')
				for name, collection of options.collections
					@registerViewCollection name, collection

		#
		# This method is called after the method initialize.
		afterInitialize: (options) ->
			#console.log 'afterInitialize'
			
			# Initialize the state machine
			@startStateMachine()

			# if we haven't a @containerSelector declared, skip
			unless @containerSelector
				return

			# Render automatically if set by options or instance property
			# and the option do not override it
			byOption = options and options.autoRender is true
			byDefault = @autoRender and not byOption
			@render() if byOption or byDefault

		#
		# Return all registered collections
		getRegisteredCollections: ->
			return _( @_registeredCollections ).values();
		
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