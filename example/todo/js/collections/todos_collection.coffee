define ['collection', 'models/todo_model', 'utils/store'], (Collection, TodoModel, Store) ->

	class TodosCollection extends Collection
		
		model: TodoModel
		url: 'todos'
		localStorage: new Store("todos")

	TodosCollection