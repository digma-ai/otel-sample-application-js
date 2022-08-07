const userRouteHandler = require('./handlers/user-route-handler');

class UserRoutes {
  constructor(app) {
    this.app = app;
  }
  init() {
    this.app.post('/users', userRouteHandler.createUserRouteHandler);
    this.app.get('/users', userRouteHandler.getUsersRouteHandler);
  }
}
module.exports = UserRoutes;