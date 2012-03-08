define(
	[
		'application',
		'controller'
	],
	function(Application, Controller){
		test( "Testing Application.js", function(){  
			raises(function(){
				new Application();	
			}, 'Creating an application without name must raises an Error');

			var app = new Application('TestApp');
			// currentParams: null
			// currentControllerName: null
			// currentView: null
			// currentViewParams: null
			// previousController: null
			equal(app.currentParams, null, "app.currentParams should be null");
			equal(app.currentControllerName, null, "app.currentControllerName should be null");
			equal(app.currentView, null, "app.currentView should be null");
			equal(app.currentViewParams, null, "app.currentViewParams should be null");
			equal(app.previousController, null, "app.previousController should be null");

			console.log(app);

			stop();
			app.initializeControllerAndAction('test', 'foo');

			app.on('Controller.Initialized', function(){
				equal(app.currentControllerName, 'test' , 'currentControllerName on application should be test');
				start();
			});

			app.on('Action.Called', function(){
				notEqual(app.currentView, null, 'currentView should not be null');
			})
			
		});

		test( "Testing Controller.js", function(){
			var controller = new Controller('alpha');

			equal(controller.view, null, 'view property should be null');
			equal(controller.id, 'alpha', 'id property should be null');
		});
	}
)