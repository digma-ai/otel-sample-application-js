const express = require('express');
const { digmaRouteHandler } = require('@digma/instrumentation-express');
const otelSdk = require('./tracing');

console.log('Environment:', process.env.NODE_ENV);

const app = express();

app.use(digmaRouteHandler);

app.get('/', function(req, res) {
  res.send('hello');
});

const port = process.env.NODE_SERVER_PORT || 4000;
const host = process.env.NODE_SERVER_HOST || '0.0.0.0';

app.listen(port, host, () => {
  console.log(`Listening on http://${host}:${port}`);
});

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
