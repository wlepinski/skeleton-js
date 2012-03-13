
define(['application', 'router'], function(Application, Router) {
  'use strict';
  var app, appRouter;
  app = new Application('TodoApp');
  Backbone.sync = function(method, model, options) {
    var resp, store, _ref;
    console.log(arguments);
    store = model.localStorage || model.collection.localStorage;
    switch (method) {
      case "read":
        resp = (_ref = model.id) != null ? _ref : store.find({
          model: store.findAll()
        });
        break;
      case "create":
        resp = store.create(model);
        break;
      case "update":
        resp = store.update(model);
        break;
      case "delete":
        resp = store.destroy(model);
    }
    if (resp) {
      return options.success(resp);
    } else {
      return options.error("Record not found");
    }
  };
  appRouter = new Router();
  appRouter.match('', 'todo', 'index');
  appRouter.start();
});
