const express = require('express');
const { digmaRouteHandler } = require('@digma/instrumentation-express');
const otelSdk = require('./tracing');
const globalTracer = require('./tracer');
const calc = require('./logic/calc');
const errors = require('./logic/errors-example');

console.log('Environment:', process.env.NODE_ENV);

const app = express();

app.use(digmaRouteHandler);

app.get('/', (req, res) => {
  res.send('hello');
});

app.get('/add', async (req, res) => {
  return await globalTracer.startActiveSpan('calc add', async span => {
    try {
      console.log(req.query);
      const nums = req.query.n.map(num => Number(num));
      console.log(nums);
      const result = await calc.add(...nums);
      res.json({
        result,
      });
    }
    catch(err) {
      res.status(500).json(err);
    }
    finally {
      span.end();
    }
  })
});

app.get('/throw', (req, res) => {
  // throw new Error('This is bad.')
  errors.doAthing();
});

const port = process.env.NODE_SERVER_PORT || 4001;
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
