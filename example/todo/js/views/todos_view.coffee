define [
	'view',
	'views/todos_list_view',
	'views/todos_stats_view'
	], (View, TodosListView, TodosStatsView) ->

	'use strict'

	class TodosView extends View

		id : 'todos'
		todosListView: null

		initialize: (options) ->
			super()

			@subscribeEvent 'Todo.Create', @createTodo

			@modelBind 'reset', @render

			@todosListView = new TodosListView
				collection : @collection

			@todosStatsView = new TodosStatsView
				collection : @collection

		createTodo: (todoText) ->
			data =
				text: todoText
				dateCreated: new Date()

			@collection.create data

		render: () ->
			@$el.append(@todosListView.el)
			@$el.append(@todosStatsView.el)

		dispose: ->
			@todosStatsView.dispose() if @todosStatsView?
			@todosListView.dispose() if @todosListView?

			super()


	TodosView