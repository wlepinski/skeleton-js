define ['collection_view', 'views/todos_list_item_view'], (CollectionView, TodosListItemView) ->

    'use strict'

    #
    # Class TodosListView is a custom implementation of the CollectionView.
    class TodosListView extends CollectionView

        itemView: TodosListItemView
        tagName: 'ul'
        id: 'todo-list'

    TodosListView