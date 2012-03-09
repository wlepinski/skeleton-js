define ->

	###
	StateMachine Class
	###
	StateMachine =
		
		#
		# Start the state machine with the a bunch of options
		startStateMachine: (@options = {}) ->
			@_transitions = {}
			@_states = {}
				
			@bindStates()
			@bindTransitions()

			if @options.currentState
				@currentState = options.currentState

			unless @currentState
				throw new Error("Provide a currentState for the view #{ @name }")

			return
		
		#
		# Create a state.
		# @param stateName The name of the state
		# @param stateData The configuration data of the the given state
		createState: (stateName, stateData) ->
			@_states[stateName] = stateData
		
		#
		# Create a new transition.
		# @param leaveState The name of the leave state 
		# @param event The transition event
		# @param data The data related to the event
		createTransition: (leaveState, event, data) ->
			unless _.has @_states, data.enterState
				throw Error("StateMachine#createTransition: Unknown state #{ data.enterState }")

			unless _.has @_transitions, leaveState
				@_transitions[leaveState] = {}
				@_transitions[leaveState][event] = data

		#
		# Create the internal states based on the declared states.
		bindStates: ->
			unless @states
				return

			for stateName, stateData of @states
				data = _.clone stateData
				data.onEnter = @collectMethods data.onEnter or= []
				data.onLeave = @collectMethods data.onLeave or= []

				# Create the state
				@createState stateName, data

			return

		#
		# Create the internal transitions based on the declared transitions.
		bindTransitions: ->
			unless @transitions
				return

			for leaveState, events of @transitions
				for transitionName, transitionData of events
					data = _.clone transitionData
					data.callbacks = @collectMethods data.callbacks or= []

					# Create the transition
					@createTransition leaveState, transitionName, data

			return

		#
		# Transit the state machine to another state.
		#
		# If the silent property is set to true, no events will be triggered.
		# Extra arguments can be passed along. 
		#
		# @param event The event to be transitioned
		# @param silent Whether to dispatch the transition events such as leaveState:* enterState:*
		transitTo: (event, silent = false) ->
			unless _.has @._transitions, @currentState
				return false

			unless _.has @_transitions[@currentState], event
				return false

			data = @_transitions[@currentState][event]
			extraArgs = _.toArray(arguments).slice 3

			# Do the transition
			@doTransition.apply this, [data, event, silent].concat extraArgs
			return
		
		#
		# Execute the transition.
		# @param data 
		# @param event
		# @param silent
		doTransition: (data, event, silent = false) ->
			extraArgs = _.toArray(arguments).slice 3
			leaveState = this.currentState
			enterState = data.enterState
			triggers = data.triggers

			unless silent
				@trigger.apply this, ['leaveState:' + leaveState].concat extraArgs

			@callCallbacks @_states[leaveState].onLeave, extraArgs

			unless silent
				@trigger.apply this, ['transition', leaveState, enterState].concat extraArgs

				# Verify if we have other trigger to be called, if so, call passing the extra arguments
				if triggers?
					for trigger in triggers
						@trigger.apply this, [trigger].concat extraArgs
			
			# Call the callbacks
			@callCallbacks data.callbacks, extraArgs

			unless silent
				@trigger.apply this, ['enterState:' + enterState].concat extraArgs
			
			@toState.apply this, [enterState].concat extraArgs

			return

		#
		# Convenience method for calling a list of callbacks.
		# @param callbacks Array of callbacks to be called in sequence
		# @param extraArgs Array with extra arguments to be passed within the callback call
		callCallbacks: (callbacks, extraArgs) ->
			for callback in callbacks
				callback.apply this, extraArgs

		#
		# Change state currentState and call the onEnter callbacks.
		# @param name The name of the new state
		toState: (name) ->
			unless _.has @_states, name
				throw new Error("StateMachine#toState: Looks like the state #{ name } is not declared on #{ this }")

			extraArgs = _.toArray( arguments ).slice 1
			onEnter = @_states[name].onEnter
			@callCallbacks onEnter, extraArgs
			@currentState = name
		
		#
		# Collects the methods based on the method names.
		# @param methodNames The names of the methods to be collected
		collectMethods: (methodNames) ->
			methods = []

			for methodName in methodNames
				method = this[methodName]

				unless method
					throw new Error("Method ' #{methodName} ' does not exist")

				methods.push method

			return methods

	StateMachine