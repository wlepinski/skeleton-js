define ['view'], (View) ->

	class ItemView extends View

		template : null

		render: ->
			@$el.html @template @model.toJSON()

		dispose: ->
			@remove()

	ItemView