define ['application', 'route'], (Application, Route) ->

	'use strict'

	###
	Router class
	###
	class Router

		# Mix with Backbone.Events
		_(Router.prototype).defaults(Backbone.Events)

		#
		# Properties
		enablePushState: false
		routes: {}

		#
		# Private
		_createdRoutes: []
		_router : null

		#
		# Constructor
		constructor: (@enablePushState) ->
			@_createdRoutes = []
			@_router = null

		#
		# Bind the routes created throught the routes object into separated Route objects
		bindRoutes: ->
			defaultConfigs =
				constraints : {}
				params : {}

			for pattern, config of @routes
				# Is a object
				if _.isObject config
					# Extends the default configuration
					config = _(defaultConfigs).extend(config)
					# If the config doesnt have a target key, throw an error
					unless _.has config, 'target'
						throw new Error "You should provide a target controller and action pair for the #{pattern} pattern."

					controllerAction = config.target
				else if _.isString config
					controllerAction = config

				# If the target is a string
				controllerActionArr = controllerAction.split "#"
				if _.isArray( controllerActionArr ) and controllerActionArr.length isnt 2
					throw new Error "Router#bindRoutes: The format of the routing configuration for the pattern '#{pattern}' is incorrect."

				[controller, action] = controllerActionArr

				# Delegate the creating to the method match
				@match pattern, controller, action, config.constraints, config.params

		#
		# Start router
		start: ->
			@bindRoutes()

			# Check if we have routes created
			if @_createdRoutes.length == 0
				throw new Error 'Router#start: Could you please provide at least 1 route for me?'

			# Because hash-based history in Internet Explorer relies on an iframe, 
			# be sure to only call start() after the DOM is ready.
			Backbone.history.start({ pushState: @enablePushState })

			return

		#
		# Create a route.
		#
		# @param pattern 
		# @param controller
		# @param action
		# @param constraints
		# @param params
		match: (pattern, controller, action, constraints, params) ->
			# console.log "Router#match: pattern:'#{pattern}', controller:'#{controller}', action:'#{action}'"
			# Create a Route object with the arguments
			route = new Route pattern, controller, action, constraints, params

			# Create a Backbone history instance (singleton)
			Backbone.history or= new Backbone.History

			# Register the route at the Backbone History instance
			Backbone.history.route route, route.handler

			# Add the route
			@_createdRoutes.push route

		#
		# Route to a given URL, manually
		route: (path) ->
			# Remove leading hash or slash
			path = path.replace /^(\/#|\/)/, ''
			
			for handler in Backbone.history.handlers
				if handler.route.test(path)
					handler.callback path, changeURL: true
					return true
			false

	Router