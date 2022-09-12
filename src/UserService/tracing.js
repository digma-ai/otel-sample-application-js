const opentelemetry = require("@opentelemetry/sdk-node");
const { getNodeAutoInstrumentations } = require("@opentelemetry/auto-instrumentations-node");
const { Resource } = require('@opentelemetry/resources');
const { SemanticResourceAttributes } = require('@opentelemetry/semantic-conventions');
const { diag, DiagConsoleLogger, DiagLogLevel } = require('@opentelemetry/api');
// const { diag, DiagConsoleLogger, DiagLogLevel } = require('@opentelemetry/api');
// const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-http');
// const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-proto');
const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-grpc');
// const { BatchSpanProcessor } = require("@opentelemetry/sdk-trace-base");
// const { NodeTracerProvider } = require('@opentelemetry/sdk-trace-node');
// const { registerInstrumentations } = require('@opentelemetry/instrumentation');
// const { HttpInstrumentation } = require('@opentelemetry/instrumentation-http');
// const { ExpressInstrumentation } = require('@opentelemetry/instrumentation-express');
const { ConsoleSpanExporter, BatchSpanProcessor } = require("@opentelemetry/sdk-trace-base");
const { JaegerExporter } = require("@opentelemetry/exporter-jaeger");
const { digmaAttributes } = require('@digma/otel-js-instrumentation');
const { applyDigmaInstrumentation } = require('@digma/instrumentation-express');
const config = require('config');

// For troubleshooting, set the log level to DiagLogLevel.DEBUG
diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.INFO);
const otelEndpoint = config.get('otel.endpoint');

const jaegerExporter = new JaegerExporter({
  endpoint: 'http://localhost:14268/api/traces',
});

const otlpExporter = new OTLPTraceExporter({
  // optional - url default value is http://localhost:4318/v1/traces
  url: otelEndpoint,

  // optional - collection of custom headers to be sent with each request, empty by default
  // headers: {},
});

const consoleSpanExporter = new ConsoleSpanExporter();

const exporter = otlpExporter;

// const expressInstrumentation = new ExpressInstrumentation();
// expressInstrumentation.setConfig({
//   requestHook: function(span, info) {
//     diag.info('*** request hook:', span, info)
//     span.setAttribute('test-attribute', 'eureka!')
//   },
// })

// const expressInstrumentation = new ExpressInstrumentation({
//   requestHook: function(span, info) {
//     diag.info('*** request hook:', span, info)
//     span.setAttribute('test-attribute', 'eureka!')
//   },
// })

const sdk = new opentelemetry.NodeSDK({
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: "user-service", // process.env.SERVICE_NAME,
    ...digmaAttributes({
      rootPath: __dirname,
      otherPackages: [
        'config',
        'express',
        '@opentelemetry/sdk-node',
      ],
    }),
  }),
  spanProcessor: new BatchSpanProcessor(exporter),
  instrumentations: [getNodeAutoInstrumentations()],

  // // manually create http and express instrumentations
  // instrumentations: [
  //   new HttpInstrumentation(),
  //   expressInstrumentation,
  // ],

  // // pass config to auto instrumentations
  // instrumentations: [
  //   getNodeAutoInstrumentations({
  //     '@opentelemetry/instrumentation-http': {
  //       requestHook: function(span, info) {
  //         diag.info('>>> http request hook:', span, info)
  //         span.setAttribute('a-test', 'http')
  //       },
  //     },
  //     '@opentelemetry/instrumentation-express': {
  //       requestHook: function(span, info) {
  //         diag.info('>>> express request hook:', span, info)
  //         span.setAttribute('a-test', 'express')
  //         span.spanContext()
  //       },
  //     },
  //   }),
  // ],
});

applyDigmaInstrumentation(sdk);

// initialize the SDK and register with the OpenTelemetry API
// this enables the API to record telemetry
sdk.start()
  .then(() => console.log('Tracing initialized'))
  .catch((error) => console.log('Error initializing tracing', error));

module.exports = sdk;
