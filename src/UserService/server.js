const express = require('express');
const http = require('http');

const UserRoutes = require('./user-route');

class Server {
  constructor() {
    this.app = express();
   // this.http = http.Server(this.app);
  }

  includeRoutes() {
    new UserRoutes(this.app).init();
  }

  startTheServer() {
    this.includeRoutes();

    const port = process.env.NODE_SERVER_POST || 4000;
    const host = process.env.NODE_SERVER_HOST || '0.0.0.0';

    this.app.listen(port, host, () => {
      console.log(`Listening on http://${host}:${port}`);
    });
  }
}

module.exports = new Server();