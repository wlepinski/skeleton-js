define ['view'], (View) ->
	
	###
		CollectionView Class
		
		The CollectionView is a specialization of the base View class which provide a way to render a view
		that will use a collection in order to render multiple elements based on a item renderer.
	###
	class CollectionView extends View

		itemRenderer: null
		
	return CollectionView