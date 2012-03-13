define [
	'eventbus'
	'ext/string'
], (EventBus, StringExt) ->
	
	'use strict'

	#
	# This method is called when a controller is loaded.
	#
	# When a controller is loaded, we need to dispose the currentController and trigger the specified
	# action the the loaded controller.
	#
	# @param controllerName
	# @param action
	# @param params
	# @param controllerClass
	onControllerLoaded = (controllerName, action, params, controllerClass) ->
		@disposeCurrentController()
		@initializeController controllerName, params, controllerClass
		@callControllerAction action, params

	###
	Application Class
	###
	class Application

		# Application.prototype should inherit the defaults from Backbone.Events
		_(Application.prototype).defaults Backbone.Events

		#
		# Properties
		siteTitle: 'Application'
		currentParams: null
		currentControllerName: null
		currentView: null
		currentViewParams: null
		previousController: null

		#
		# Constructor
		#
		# @param name The name of the application
		constructor: (@name) ->
			if !@name?
				throw new Error 'Every application must have a name'

			@initializeControllers()
			@initializeEvents()

			return

		#
		# Subscribe to relevant events on the EventBus.
		initializeEvents: ->
			# Subscribe to the event Route.Matched, so we are able to instanciate a new controler and action
			EventBus.subscribe 'Route.Matched', (route, params) =>
				controllerName = route.controller
				action = route.action

				# Initialize the controller and action for the matched route
				@initializeControllerAndAction(controllerName, action, params)
		
		#
		# Initialize controllers
		# This method is a extension point for custom implementations.
		initializeControllers: ->

		#
		# Initializes a controller and a action.
		#
		# @param controllerName The name of the controller that will be loaded
		# @param action The action to be loaded. Defaults to index
		# @param params The params to be used while instantiating the action
		initializeControllerAndAction: (controllerName, action = 'index', params = {}) ->
			isSameController = @currentControllerName is controllerName

			if isSameController
				isSameAction = @currentAction is action and (@currentParams? or @currentParams)
			else
				controllerFileName = StringExt.underscorize controllerName + '_controller'
				callback = _.bind onControllerLoaded, this

				# Use the require.js library to load the controller. When the require is finished, execute
				# the method onControllerLoaded
				require ['controllers/' + controllerFileName], 
					_(callback).bind(@, controllerName, action, params)

		#
		# Disposes the actual controller loaded
		disposeCurrentController: ->
			if @currentController
				unless @currentController.dispose? and _.isFunction @currentController.dispose
					throw new Error('Application#onControllerLoaded: A dispose method should be provided on ' + @currentControllerName)
				@currentController.dispose()

				# Clean up the fields
				@currentController = null
				@currentControllerName = null
				@currentView = null
				@currentViewParams = null
				@currentParams = null

		#
		# Instanciate a new controller and cache the properties.
		#
		# After the initialization a 'Controller.Initialized' event is triggered passing the newly
		# instanciated controller. 
		#
		# @param controllerName The controller name to be instanciated and initialized
		# @param params Object with parameters used on the initialize method of the controller
		# @param controllerClass The controller class
		initializeController: (controllerName, params, controllerClass) ->
			# Create a new instance and call the initialize method
			controller = new controllerClass()
			controller.initialize params

			@previousController = this.currentControllerName
			@currentControllerName = controllerName
			@currentController = controller

			@trigger 'Controller.Initialized', controller

		#
		# Call an action on the current controller.
		#
		# After the call, an event 'Action.Called' will be triggered passing as parameter the
		# current view. The current view is obtained calling the currentController.view.
		#
		# @param action The action that will be called
		# @param params The params that will be passed along the action's call
		callControllerAction: (action, params) ->
			if !@currentController?
				throw new Error('You must have an active controller in order to call an specific action')

			actionName = StringExt.camelize action

			unless _.isFunction ( @currentController[action] )
				throw new Error("Application#callControllerAction: We can't find a method called " + 
					actionName + " on the controller " + @currentController.id)
			
			# Call the action passing the parameters
			@currentController[actionName] params

			# Sets the current view and current parameters
			@currentView = @currentController.view
			@currentViewParams = params

			# Trigger an event called Action.Called passing up the action
			@trigger 'Action.Called', @currentView

	Application
							