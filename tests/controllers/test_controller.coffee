define ['controller'], (Controller) ->
	
	class TestController extends Controller
		
		constructor: ->
			super('test_controller')
		
		index: ->
			@view = 'index'

		foo: ->
			@view = 'hello'

	TestController