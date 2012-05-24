define ['collection', 'models/todo_model', 'utils/store'], (Collection, TodoModel, Store) ->

	#
	#
	class TodosCollection extends Collection

		model: TodoModel
		url	: 'todos'
		localStorage: new Store("todos")

		# Filter down the list of all todo items that are finished.
		getDone: ->
			return @filter (todo) ->
				return todo.get 'done'

		# Filter down the list to only todo items that are still not finished.
		getRemaining: ->
			return @without.apply this, @getDone()

		comparator: (first, second) ->
			firDateCreated = new Date(first.get('dateCreated')).getTime()
			secDateCreated = new Date(second.get('dateCreated')).getTime()

			return 1 if firDateCreated < secDateCreated
			return 0 if firDateCreated is secDateCreated
			return -1 if firDateCreated > secDateCreated

	TodosCollection