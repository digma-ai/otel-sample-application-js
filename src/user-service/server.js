const express = require('express');
const users = require('./routes/users/users');
const AppConfig = require('./config/app-config');

class Server {
  constructor() {
    this.app = express();
  }

  includeRoutes() {
    this.app.use('/users', users);
    this.app.get('/health', (req, res)=>{
      res.status(200).json({
        error: false,
        details: '',
      });
    });
  }

  appConfig() {
    new AppConfig(this.app).includeConfig();
  }

  startTheServer() {
    this.appConfig();
    this.includeRoutes();

    const port = process.env.NODE_SERVER_PORT || 4000;
    const host = process.env.NODE_SERVER_HOST || '0.0.0.0';

    this.app.listen(port, host, () => {
      console.log(`Listening on http://${host}:${port}`);
    });
  }
}

module.exports = new Server();
