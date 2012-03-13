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
			this.collection = new TodosCollection();
			this.collection.fetch({
				success: (data) ->
					console.log data
			});

			this.view = new TodosView({
				collection : this.collection
			});

	TodoController