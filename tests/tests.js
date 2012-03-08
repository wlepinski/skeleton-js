define(
	[
		'application',
		'controller',
		'eventbus',
		'subscriber',

		'collections/foo_collection',
		'controllers/test_controller',
		'models/foo_model',
		'views/foo_view'
	],
	function(Application, Controller, EventBus, Subscriber, FooCollection, TestController, FooModel, FooView){

		//
		// Controller.js Module
		//
		//

		(function(){

			module('Application.js');

			test( "Testing Application.js", function(){  
				
				expect(8);

				raises(function(){
					new Application();	
				}, 'Creating an application without name must raises an Error');

				var app = new Application('TestApp');
				
				equal(app.currentParams, null, "app.currentParams should be null");
				equal(app.currentControllerName, null, "app.currentControllerName should be null");
				equal(app.currentView, null, "app.currentView should be null");
				equal(app.currentViewParams, null, "app.currentViewParams should be null");
				equal(app.previousController, null, "app.previousController should be null");

				app.on('Controller.Initialized', function(){
					equal(app.currentControllerName, 'test' , 'currentControllerName on application should be test');
					start();
				});

				app.on('Action.Called', function(){
					notEqual(app.currentView, null, 'currentView should not be null');
				})

				stop();
				app.initializeControllerAndAction('test', 'foo');
				
			});

			test( "Testing Application.js disposal system", function(){  
				
				expect(5);

				var app = new Application('TestApp');

				app.on('Action.Called', function(){
					app.disposeCurrentController();
					equal(app.currentController, null, "After disposal, currentController should be null");
					equal(app.currentControllerName, null, "After disposal, currentControllerName should be null");
					equal(app.currentView, null, "After disposal, currentView should be null");
					equal(app.currentParams, null, "After disposal, currentParams should be null");
					equal(app.currentViewParams, null, "After disposal, currentViewParams should be null");
					start();
				});

				stop();
				app.initializeControllerAndAction('test', 'foo');

			});

		})();

		//
		// Controller.js Module
		//
		//
		(function(){

			module('Controller.js');

			test( "Properties state at initialization", function(){
				
				expect(4);

				var controller = new Controller('alpha');

				strictEqual(controller.currentView, null, 'currentView property should be null');
				strictEqual(controller.id, 'alpha', 'id property should not be null');

				strictEqual(controller.disposed, false, 'Controller disposed should be true before disposal');
				controller.dispose();
				strictEqual(controller.disposed, true, 'Controller disposed should be false after disposal');
			});

			test( "Testing collection registration and disposal", function(){  
				
				expect(4);

				var controller = new TestController('testController');
				var fooCollection1 = new FooCollection();
				controller.registerCollection('fooCollection1', fooCollection1);
				controller.registerCollection('fooCollection2', new FooCollection());
				controller.registerCollection('fooCollection3', new FooCollection());
				
				equal(controller.getCollections().length, 3, "App should have 3 collections registered");
				strictEqual(controller.getCollection('fooCollection1'), fooCollection1, "Collections should be equal");
				controller.dispose();
				equal(controller.getCollections().length, 0, "App should have no collections registered after disposal");

				raises(function(){
					controller.getCollection('fooCollection1')
				}, 'Should raise an error when trying to get a collection not registered');
			});

			test( "Testing model registration and disposal", function(){  
				
				expect(4);

				var controller = new TestController('testController');
				var fooModel = new FooModel();
				controller.registerModel('fooModel1', fooModel);
				
				equal(controller.getModels().length, 1, "App should have 3 models registered");
				strictEqual(controller.getModel('fooModel1'), fooModel, "Models should be equal");
				controller.dispose();
				equal(controller.getModels().length, 0, "App should have no models registered after disposal");

				raises(function(){
					controller.getModel('fooModel1')
				}, 'Should raise an error when trying to get a model not registered');
				
			});

		})();

		//
		// Model.js Module
		//
		//
		(function(){

			module('Model.js');
		
		})();

		//
		// View.js Module
		//
		//
		(function(){

			module('View.js');

			test( "Testing view collections registration", function(){  
				
				expect(3);

				var fooCollection = new FooCollection();
				var view = new FooView({
					model : new FooModel(),
					collections : {
						'fooCollection' : fooCollection
					}
				});
				
				equal(view.getRegisteredCollections().length, 1, "View should have 1 registered collection");
				equal(view.getRegisteredCollection('fooCollection'), fooCollection, "Collection should be strict equal");
				equal(view.getRegisteredCollection('nonExistingCollection'), null, "Should return null for a non existing collection");
			});

			test( "Testing view collections disposal", function(){  
				
				expect(2);

				var fooCollection1 = new FooCollection();
				var fooCollection2 = new FooCollection();
				var fooCollection3 = new FooCollection();

				var view2 = new FooView({
					model : new FooModel(),
					collections : {
						'fooCollection1' : fooCollection1,
						'fooCollection2' : fooCollection2,
						'fooCollection3' : fooCollection3
					}
				});
				
				equal(view2.getRegisteredCollections().length, 3, "View should have 3 registered collection");
				view2.dispose();
				equal(view2.getRegisteredCollections().length, 0, "View should have no collections registered");
			});

			test( "Testing view disposal", function(){ 
				var view = new FooView();
				view.dispose();

				ok(view.disposed, 'Disposed should be true');
			});

			test( "Testing global event pub/sub", function(){  
				
				expect(3);

				var view = new FooView();
				view.subscribeEvent('globalEvent1', function(){
					console.log('test');
				});

				equal(view.globalSubscriptions['globalEvent1'].length, 1, "The event should be registered on the view");
				notEqual(EventBus._callbacks['globalEvent1'], null, "The event should be registered on EventBus");

				view.dispose();
				equal(view.globalSubscriptions, null, "No more events on globalSubscriptions");
			});
		
		})();

		//
		// Collection.js Module
		//
		//
		(function(){
			
			module('Collection.js');

		})();

	}
)