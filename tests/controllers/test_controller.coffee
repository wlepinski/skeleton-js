define ['controller'], (Controller) ->
	
	class TestController extends Controller
		constructor: ->
			super('test_controller')
			
		foo: ->
			@view = 'hello'

	TestController