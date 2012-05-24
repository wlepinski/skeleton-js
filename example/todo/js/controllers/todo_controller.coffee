define [
	'controller',
	'collections/todos_collection',
	'views/todos_view',
	'models/todo_model'
	], (Controller, TodosCollection, TodosView, TodoModel) ->

	###
	TodoController
	###
	class TodoController extends Controller

		constructor: () ->
			super 'todo'

		index: () ->
			@collection = new TodosCollection();
			@view = new TodosView
				collection : @collection

			$('#content').append(@view.el)

			@collection.fetch()

		dashboard: () ->
			@collection = new TodosCollection();
			@view = new TodosView
				collection : @collection

			console.log @view.el
			$('#content').append(@view.el)

			@collection.fetch()

	TodoController