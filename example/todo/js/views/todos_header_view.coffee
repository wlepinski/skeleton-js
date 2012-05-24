define ['view', 'eventbus'], (View, EventBus) ->

	'use strict'
	
	class TodosHeaderView extends View

		el: $("#todoapp header")

		initialize: ->
			super

			@delegate 'keypress', '#new-todo', @createTodo
			@delegate 'focusout', '#new-todo', @createTodo

		createTodo: (event) ->
			text = $(event.target).val()
			
			# Return if we dont have a text and the keyCode is not the Enter key
			return if !text or (event.type is 'keypress' and event.keyCode isnt 13)

			# Dispatch an event
			EventBus.publish('Todo.Create', text);

			# Clean up the field
			$(event.target).val('')

	TodosHeaderView