define ['view'], (View) ->

	class FooView extends View
		
		className: 'fooView'

		subscriptions:
			loginEvent: 'onLogin'

		constructor: (options) ->
			super options

		onLogin: (event) ->
			console.log(event)

	FooView