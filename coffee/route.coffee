define ['eventbus'], (EventBus) ->

	'use strict'

	###
	Route Class
	###
	class Route

		#
		# Properties
		paramNames : []

		#
		# Constructor
		#
		# @param pattern
		# @param controller
		# @param action
		# @param constraints
		# @param params
		constructor: (@pattern, @controller, @action = 'index', @constraints = {}, @params = {}) ->
			unless @controller?
				throw new Error 'A controller must be defined'

			@handler = _.bind @handler, this

			# Replace :parameters, collecting their names
			@paramNames = []
			pattern = pattern.replace /:(\w+)/g, @addParamName

			# Create the actual regular expression
			@regExp = ///^#{pattern}(?=\?|$)///

		#
		# If this route is matched by 
		handler: (path) ->
			# console.log "Route#handler: path #{path}", arguments
			
			# Build params hash
			params = @buildParams path

			# Publish a global routeMatch event passing the route and the params
			EventBus.publish 'Route.Matched', this, params	
			
		# Create a proper Rails-like params hash, not an array like Backbone
		# matches and additionalParams arguments are optional
		# 
		# @param path
		# @param options
		buildParams: (path, options) ->
			#console.debug 'Route#buildParams', path, options
			params = @extractParams path

			# Add additional params from options
			# (they might overwrite params extracted from URL)
			_(params).extend @params

			# Add a param whether to change the URL
			# Defaults to false unless explicitly set in options
			params.changeURL = Boolean(options and options.changeURL)

			# Add a param with the whole path match
			params.path = path
			params

		#
		# Add a named param.
		#
		# @param match
		# @param paramName
		# @return The translated regex to be used as the Route's URL pattern
		addParamName: (match, paramName) =>
			# Save parameter name
			@paramNames.push paramName

			# Replace with a character class
			'([\\w-]+)'

		#
		# Test is a given path is valid on the current constraints and params.
		#
		# @param path The path to be tested
		# @return True if the path is valid for this Route object or false otherwise.
		test: (path) ->
			matched = @regExp.test path
			return false unless matched

			if _(@constraints).keys().length > 0
				params = @extractParams path
				for own name, constraint of @constraints
					unless constraint.test(params[name])
						return false

			return true

		# Extract parameters from the URL.
		#
		# @param path
		extractParams: (path) ->
			params = {}

			# Apply the regular expression
			matches = @regExp.exec path

			# Fill the hash using the paramNames and the matches
			for match, index in matches.slice(1)
				paramName = @paramNames[index]
				params[paramName] = match

			params

	return Route