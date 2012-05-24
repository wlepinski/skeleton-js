define ['model'], (Model) ->

	class TodoModel extends Model
		defaults:
			text: null
			dateCreated: null
			done: false
	TodoModel