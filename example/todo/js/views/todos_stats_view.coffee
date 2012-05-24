define ['view'], (View) ->

	class TodosStatsView extends View

		id : 'todo-stats'

		template: _(
			"""
			<% if (done) { %>
				<a href="#" id="clear-completed">Clear all <%= done %> completed <%= done == 1 ? 'item' : 'items' %></a>
			<% } %>
			<div class="todo-count"><b><%= remaining %></b> <%= remaining == 1 ? 'item' : 'items' %> left</div>
			"""
		).template()

		initialize: (options) ->
			super options

			@modelBind 'change:done', @render
			@modelBind 'add', @render
			@modelBind 'remove', @render
			@modelBind 'reset', @render

			@delegate 'click', 'a#clear-completed', @clearCompleted

		clearCompleted: (event) ->
			_.each @collection.getDone(), (todo) ->
				todo.destroy()

			event.preventDefault();

		render: () ->
			done = @collection.getDone().length;
			remaining = @collection.getRemaining().length;

			@$el.html @template
				done: done,
				remaining: remaining

	TodosStatsView