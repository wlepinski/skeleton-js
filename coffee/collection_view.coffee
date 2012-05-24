define ['view'], (View) ->

	'use strict'

	###
		CollectionView Class
		The CollectionView is a specialization of the base View class which provide a way to render a view
		that will use a collection in order to render multiple elements based on a item renderer.
	###
	class CollectionView extends View

		# The view that will be used to create each item on the collection
		itemView: null

		#
		#
		constructor: (options) ->
			#console.log "CollectionView#constructor", options
			super options

		#
		# Initialize method.
		initialize: (options) ->
			#console.log "CollectionView#initialize", options
			super options

			@subscribeEvents()

		#
		# Subscribe to events 'add', 'remove' and 'reset' on model
		subscribeEvents: ->
			@modelBind 'add', _.bind @addChild, this
			@modelBind 'remove', _.bind @removeChild, this
			@modelBind 'reset', _.bind @addChildren, this
			return

		#
		#
		addChild: (model, collection, options = {}) ->
			child = @createChild model, options
			@renderChild child, options

		#
		#
		removeChild: (model, collection, options) ->
			if child = @children[model.cid]
				child.dispose()
				delete @children[model.cid]

		#
		#
		addChildren: (collection, options = {}) ->
			# Dispose children before adding new ones
			@disposeChildren()

			# Iterate the collection and create each child
			collection.each (model) =>
				@addChild model, collection, options

			return

		#
		# Render a child into the child list
		renderChild: (child, options = {}) ->
			child.render()

			children = @$el.children()

			if options.index isnt undefined and children.length isnt 0
				@$el.children().eq(options.index).before(child.el)
			else @$el.append child.el

			return child

		#
		#
		createChild: (model, options) ->
			# Instanciate the child
			child = new @itemView({ model : model })

			# Stores the child
			@storeView child

			return child

		#
		#
		storeView: (viewInstance) ->
			@children or= {}
			@children[viewInstance.model.cid] = viewInstance

		#
		#
		disposeChildren: () ->
			return unless @children?

			_(@children).each (child) ->
				child.dispose()
			@children = null
		#
		#
		render: () ->
			# console.log "CollectionView#render", arguments
			@addChildren @collection

		dispose: () ->
			super()


	return CollectionView