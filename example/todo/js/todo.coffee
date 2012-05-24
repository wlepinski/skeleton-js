define ['application', 'router', 'views/todos_header_view'], (Application, Router, TodosHeaderView) ->

	'use strict'

	# Overriding Backbone.sync to use the localStorage instead the normal jqXHR requests
	Backbone.sync = (method, model, options) ->
		def = $.Deferred()
		store = model.localStorage or model.collection.localStorage

		switch method
			when "read"
				resp = if model.id then store.find(model) else store.findAll()
			when "create" then resp = store.create model
			when "update" then resp = store.update model
			when "delete" then resp = store.destroy model

		if resp
			def.resolve()
			options.success resp
		else
			def.fail()
			options.error "Record not found"

		return def.promise()

	# Creating a custom Application
	class TodoApplication extends Application
		constructor: ->
			super 'TodoApplication'

		initializeControllers: ->
			new TodosHeaderView()

	app = new TodoApplication()

	# Router
	appRouter = new Router();
	appRouter.match('', 'todo', 'index');
	appRouter.match('dashboard', 'todo', 'dashboard');
	appRouter.start()

	return