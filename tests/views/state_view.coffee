define ['view'], (View) ->

	class StateView extends View
		
		states:
			normal:
				onEnter: ['onEnterNormalState']
				onLeave: ['onLeaveNormalState']
			foo:
				onEnter: ['onEnterFooState']
				onLeave: ['onLeaveFooState']

		transitions:
			normal:
				toFoo:
					enterState: "foo"
					callbacks: ['otherCallback']
					triggers: ['fooEvent']
			foo:
				toNormal:
					enterState: "normal"
					callbacks: ['otherCallback']
					triggers: ['fooEvent']

		constructor: (options) ->
			@onEnterNormalState = ->
				#console.log 'onEnterNormalState'

			@otherCallback = ->
				#console.log 'otherCallback'

			@onLeaveNormalState = ->
				#console.log 'onLeaveNormalState'

			@onEnterFooState = ->
				#console.log 'onEnterFooState'
				
			@onLeaveFooState = ->
				#console.log 'onLeaveFooState'

			super options

	StateView