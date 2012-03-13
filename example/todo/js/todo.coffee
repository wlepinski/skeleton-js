define ['application', 'router'], (Application, Router) ->

	'use strict'

	# Application
	app = new Application 'TodoApp';

	Backbone.sync = (method, model, options) ->
		console.log arguments
		store = model.localStorage or model.collection.localStorage
		switch method
			when "read" 	then resp = model.id ? store.find model : store.findAll()
			when "create" 	then resp = store.create model
			when "update" 	then resp = store.update model
			when "delete" 	then resp = store.destroy model
		if resp
			options.success resp
		else
			options.error "Record not found"
	
	# Router
	appRouter = new Router();
	appRouter.match('', 'todo', 'index');
	appRouter.start()

	return