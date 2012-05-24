define ['item_view'], (ItemView) ->

	class TodosListItemView extends ItemView

		tagName: 'li'

		template: _("""
				<% dateCreated = new Date(dateCreated); %>
				<div class="<%= (done) ? 'view done' : 'view' %>">
					<input <%= (done) ? 'checked' : '' %> title="Check as done" class="toggle" type="checkbox" />
					<span><%=text%>
						<small>
							<%=dateCreated.getDate()%> /
							<%=dateCreated.getMonth()+1%> /
							<%=dateCreated.getFullYear()%>
						</small>
					</span>

					<a href="#" class="destroy"></a>
				</div>
				<input class="edit-input" type="text" value="<%=text%>">
		""").template()

		initialize: (options) ->
			super

			@modelBind 'change', @render

			@delegate 'click', 'a.destroy', @onDestroy
			@delegate 'dblclick', 'div', @onDblClick
			@delegate 'click', 'input.toggle', @toggleTodo
			@delegate 'blur', 'input.edit-input', @onEditBlur
			@delegate 'keypress', 'input.edit-input', @onEditKeyPress

		toggleTodo: (event) ->
			isDone = $(event.target).is(':checked')
			@model.set 'done', isDone
			@model.save()

		onEditKeyPress: (event) ->
			return unless event.keyCode is 13

			@model.set 'text', $(event.target).val()
			@model.save()

		onEditBlur: (event) ->
			@$el.removeClass('editing')

		onDblClick: (event) ->
			@$el.addClass('editing')
			@$el.find('input.edit-input').focus()

		onDestroy: (event) ->
			@model.destroy()

	TodosListItemView