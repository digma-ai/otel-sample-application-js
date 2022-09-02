const express = require('express');
const users = require('./routes/users/users');
const AppConfig = require('./config/app-config');
const otelSdk = require('./tracing');

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

const gracefulShutdown = async () => {
  console.log("otelSdk shutdown...");
  await otelSdk.shutdown();
};

process.on('SIGINT', async () => {
  console.log(`SIGINT`);
  await gracefulShutdown();
});

// gracefully shut down the SDK on process exit
process.on('SIGTERM', async () => {
  console.log(`SIGTERM`);
  await gracefulShutdown();
});

process.on('uncaughtException', async err => {
  console.log(`uncaughtException: ${err}`);
  await gracefulShutdown();
});

process.on('exit', async code => {
  console.log(`Process exited with code: ${code}`)
  await gracefulShutdown();
});

module.exports = new Server();
