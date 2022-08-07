// Require dependencies
// const opentelemetry = require("@opentelemetry/sdk-node");
 const { getNodeAutoInstrumentations } = require("@opentelemetry/auto-instrumentations-node");
// const { diag, DiagConsoleLogger, DiagLogLevel } = require('@opentelemetry/api');
//const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-http');
const { OTLPTraceExporter } =  require('@opentelemetry/exporter-trace-otlp-proto');

// const { BatchSpanProcessor } = require("@opentelemetry/sdk-trace-base");
const opentelemetry = require("@opentelemetry/sdk-node");
const { registerInstrumentations } = require('@opentelemetry/instrumentation');
const { NodeTracerProvider } = require('@opentelemetry/sdk-trace-node');
const { Resource } = require('@opentelemetry/resources');
const { SemanticResourceAttributes } = require('@opentelemetry/semantic-conventions');
const { HttpInstrumentation } = require('@opentelemetry/instrumentation-http');
const { BatchSpanProcessor } = require("@opentelemetry/sdk-trace-base");
const { diag, DiagConsoleLogger, DiagLogLevel } = require('@opentelemetry/api');
const { JaegerExporter } = require("@opentelemetry/exporter-jaeger");

const process = require('process');


// For troubleshooting, set the log level to DiagLogLevel.DEBUG
//diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.INFO);


// module.exports = (serviceName) => {
//   const provider = new NodeTracerProvider({
//     resource: new Resource({
//       [SemanticResourceAttributes.SERVICE_NAME]: serviceName,
//     }),
//   });

//   const exporter = new OTLPTraceExporter({
//     // optional - url default value is http://localhost:4318/v1/traces
//     url: 'localhost:4317/v1/traces',

//     // optional - collection of custom headers to be sent with each request, empty by default
//     headers: {}, 
//   });

//   provider.addSpanProcessor(new BatchSpanProcessor(exporter));

//   // Initialize the OpenTelemetry APIs to use the NodeTracerProvider bindings
//   provider.register();

//   registerInstrumentations({
//     instrumentations: [
//       new HttpInstrumentation(),
//     ],
//   });

//   return {
//     provider,
//     tracer: opentelemetry.trace.getTracer('http-example'),
//   };
// };



// For troubleshooting, set the log level to DiagLogLevel.DEBUG
diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.INFO);

const options = {
  endpoint: 'http://localhost:14268/api/traces',
}
const exporter = new JaegerExporter(options);

// const exporter = new OTLPTraceExporter({
//   // optional - url default value is http://localhost:4318/v1/traces
//   url: 'http://localhost:4317',

//   // optional - collection of custom headers to be sent with each request, empty by default
//  // headers: {}, 
// });

const sdk = new opentelemetry.NodeSDK({
  resource:new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: "user-service" // process.env.SERVICE_NAME,
  }),
  spanProcessor:new BatchSpanProcessor(exporter),
  //traceExporter: exporter,
  instrumentations: [getNodeAutoInstrumentations()]//new HttpInstrumentation()
});

// initialize the SDK and register with the OpenTelemetry API
// this enables the API to record telemetry
sdk.start()
  .then(() => console.log('Tracing initialized'))
  .catch((error) => console.log('Error initializing tracing', error));

// gracefully shut down the SDK on process exit
process.on('SIGTERM', () => {
  sdk.shutdown()
    .then(() => console.log('Tracing terminated'))
    .catch((error) => console.log('Error terminating tracing', error))
    .finally(() => process.exit(0));
});
