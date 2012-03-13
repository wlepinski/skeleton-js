define ->

	S4 = ->
		return (((1+Math.random())*0x10000)|0).toString(16).substring(1);

	guid = ->
		return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4())

	###
	Store
	###
	class Store
		
		constructor: (@name) ->
			store = localStorage.getItem @name
			@data = (store and JSON.parse(store)) or {}

		save: ->
			localStorage.setItem @name, JSON.stringify @data

		create: (model) ->
			if model.id?
				model.id = model.attributes.id = guid()
			@data[model.id] = model
			@save()

			return model

		update: (model) ->
			@data[model.id] = model
			@save()
			return model

		find: (model) ->
			return @data[model.id]

		findAll: ->
			return _.values(@data)

		destroy: (model) ->
			delete @data[model.id]
			@save()
			return model;

	Store