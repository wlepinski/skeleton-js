define ->

	'use strict'

	###
		Controller Class
	###
	class Controller

		id: undefined
		disposed: no

		currentView: null

		_registeredCollections: {},
		_registeredModels: {},

		#
		# Constructor
		constructor: (@id) ->
			if !@id?
				throw new Error('Controller instances must have an id')

			@initialize()

		#
		# Initialize method
		initialize: ->

		#
		# RenderView method
		renderView: (viewName, viewOptions = {}) ->
			viewFile = "views/#{@id}/#{viewName}_view"
			templateFile = "plugins/text!/templates/#{@id}/#{viewName}.html"
			loadDef = $.Deferred()

			require [viewFile, templateFile], (ViewClass, viewTemplate) ->
				_.extend viewOptions,
					template : viewTemplate

				viewInstance = new ViewClass(viewOptions)

				# Resolve the jQuery Deferred object passing the view instance and the template loaded
				loadDef.resolve viewInstance, viewTemplate

			return loadDef

		#
		# registerModel method
		registerModel: (name, model) ->
			unless _.has(@_registeredModels, name)
				@_registeredModels[name] = model

		#
		# Get a model registered by name
		#
		# @param name The name of the model to be returned
		# @throws Error If the model requested is not registered on this controller
		getModel: (name) ->
			unless _.has( @_registeredModels, name )
				throw new Error("The model with name #{ name } is not registered on the controller #{ @id }")

			return @_registeredModels[name]

		#
		# Return all models registered within the controller.
		# This method is useful to send all models to the View
		getModels: ->
			return _( @_registeredModels ).values()

		#
		# registerCollection method
		registerCollection: (name, collection) ->
			unless _.has(@_registeredCollections, name)
				@_registeredCollections[name] = collection

		#
		# Get a model registered by name
		#
		# @param name The name of the model to be returned
		# @throws Error If the model requested is not registered on this controller
		getCollection: (name) ->
			unless _.has( @_registeredCollections, name )
				throw new Error("The collection with name #{ name } is not registered on the controller #{ @id }")

			return @_registeredCollections[name]

		#
		# Return all collections registered within the controller.
		# This method is useful to send all collections to the View
		getCollections: ->
			return _( @_registeredCollections ).values()

		#
		# Dipose method
		# Clean up all models, global event listeners and mark this controller as disposed
		dispose: ->
			if @disposed
				return

			# Iterate throught all registeredModels and dispose
			for name, model of @_registeredModels
				model.dispose()
				delete @_registeredModels[name]

			# Iterate throught all registeredCollections and dispose
			for name, collection of @_registeredCollections
				collection.dispose()
				delete @_registeredCollections[name]

			@disposed = yes

	Controller