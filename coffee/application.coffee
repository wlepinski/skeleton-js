define [
	'eventbus'
	'ext/string'
], (EventBus, StringExt) ->

	'use strict'

	#### Private methods and properties

	#
	# This method is called when a controller is loaded.
	#
	# When a controller is loaded, we need to dispose the currentController, initialize the loaded controller
	# and trigger the specified action.
	onControllerLoaded = (controllerName, action, params, controllerClass) ->
		# Dispose the current controller
		@disposeCurrentController().done =>
			# Initialize the controller loaded
			@initializeController controllerName, params, controllerClass
			# Call the specified action on the controller
			@callControllerAction action, params

	## Application class

	# Describe the methods and properties do define an application. The main goal of this class
	# is coordinate the loaded and dispose process of controllers.
	class Application

		# Application.prototype should inherit the defaults from Backbone.Events
		_(Application.prototype).defaults Backbone.Events

		# The application title
		siteTitle: 'Application'
		# The current params being used in the current controller and action
		currentParams: null
		# Current controller name
		currentControllerName: null
		# Current view
		currentView: null
		# Current view parameters
		currentViewParams: null
		# Previous controller disposed
		previousController: null

		#### Constructor
		constructor: (@name) ->
			# console.log "Application#constructor: #{@name}"

			if !@name?
				throw new Error 'Every application must have a name'

			window.Application =
				Collections 	: {}
				Models 			: {}
				Views 			: {}

			@initialize()
			@initializeEvents()

			return

		#### Subscribe to relevant events on the EventBus.
		initializeEvents: () ->
			# console.log "Application#initializeEvents"

			# Subscribe to the event Route.Matched, so we are able to instanciate a new controler and action
			EventBus.subscribe 'Route.Matched', (route, params) =>
				controllerName = route.controller
				action = route.action

				if @loadingPromise?
					@loadingPromise.done =>
						# Initialize the controller and action for the matched route
						@initializeControllerAndAction(controllerName, action, params)
				else
					# Initialize the controller and action for the matched route
					@initializeControllerAndAction(controllerName, action, params)



		#### Initialize controllers
		initialize: () ->
			# This method is a extension point for custom implementations on sub-classes

		#### Initializes a controller and a action.
		#
		# @param controllerName The name of the controller that will be loaded
		# @param action The action to be loaded. Defaults to index
		# @param params The params to be used while instantiating the action
		initializeControllerAndAction: (controllerName, action = 'index', params = {}) ->
			# console.log "Application#initializeControllerAndAction", controllerName, action, params
			@loadingPromise = $.Deferred()

			# Is the same controller?
			isSameController = @currentControllerName is controllerName

			# Well, if we're talking about the same action we need to check if we are trying to enter
			# on the same view with the same view's parameters
			if isSameController
				isSameAction = @currentAction is action and (@currentParams? or @currentParams)

				# Dispose current action
				@disposeCurrentAction().done () =>
					# Call the new controller unless the action is not the same
					@callControllerAction action, params unless isSameAction
			else
				controllerFileName = StringExt.underscorize controllerName + '_controller'

				# Use the require.js library to load the controller. When the require is complete, we need to execute
				# the method onControllerLoaded to make the dispose and initialization process
				require ['controllers/' + controllerFileName],
					_(onControllerLoaded).bind(this, controllerName, action, params)

		#
		# Disposes the actual controller loaded
		disposeCurrentController: () ->
			defObj = $.Deferred()

			# console.log "Application#disposeCurrentController"
			if @currentController
				# console.log "Application#disposeCurrentController -> Disposing #{@currentController.id} controller"
				unless @currentController.dispose? and _.isFunction @currentController.dispose
					throw new Error "Application#onControllerLoaded: A dispose method should be provided on #{@currentControllerName}"

				@disposeCurrentAction().done =>
					# Dispose the current controller
					@currentController.dispose()
					# Clean up the fields
					@currentController = null
					@currentControllerName = null
					# Resolve the deferred object
					do defObj.resolve
			else
				# Resolve the deferred object
				do defObj.resolve

			return defObj

		#
		# Dispose the current viewed action
		disposeCurrentAction: () ->
			defObj = $.Deferred();

			if @currentView
				# FadeOut the @currentView.el
				@currentView.$el.fadeOut 200, =>
					# Dispose the current view
					@currentView.dispose()
					@currentView = null
					@currentViewParams = null
					@currentParams = null
					# Resolve the deferred object
					do defObj.resolve
			else
				# If no view, resolve the deferred object
				do defObj.resolve

			return defObj

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
				throw new Error 'You must have an active controller in order to call an specific action'

			actionName = StringExt.camelize action

			unless _.isFunction ( @currentController[action] )
				throw new Error "We can't find a method called '#{actionName}' on the controller with id '#{@currentController.id}'"

			# Call the action passing the parameters
			@viewDeferred = @currentController[actionName] params

			# Set the current view params
			@currentViewParams = params

			loadingTimer = setTimeout(->
				$('body').addClass('loading')
			, 1000)

			# Returned a deferred or promise?
			# Since the Deferred Object is just a Object, we need to check against some properties
			if @viewDeferred && _(@viewDeferred).has('state')
				@viewDeferred.done (viewInstance) =>

					# Clear the timeout
					clearTimeout loadingTimer

					# Remove loading class
					$('body').removeClass('loading')

					# Assign the view instance
					@currentView = viewInstance

					# Trigger an event called Action.Called passing up the action
					@trigger 'Action.Called', @currentView

					@viewDeferred = null

					do @loadingPromise.resolve

					# We set to null the loading promise only if there's no view pending to be resolved
					@loadingPromise = null if @loadingPromise.state() == 'resolved'


			# Ok, no deferred found, the developer sent a plain view?
			else if @currentController.view?
				# Sets the current view and current parameters
				@currentView = @currentController.view
				# Trigger an event called Action.Called passing up the action
				@trigger 'Action.Called', @currentView

			# Well, we unfortunelly have an error :(
			else
				throw new Error "The controller action #{actionName} of the #{@currentController.id} isn't returning a view."

	Application
