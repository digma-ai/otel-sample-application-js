// Require dependencies
// const opentelemetry = require("@opentelemetry/sdk-node");
 const { getNodeAutoInstrumentations } = require("@opentelemetry/auto-instrumentations-node");
// const { diag, DiagConsoleLogger, DiagLogLevel } = require('@opentelemetry/api');
//const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-http');
//const { OTLPTraceExporter } =  require('@opentelemetry/exporter-trace-otlp-proto');

// const { BatchSpanProcessor } = require("@opentelemetry/sdk-trace-base");
const opentelemetry = require("@opentelemetry/sdk-node");
//const { registerInstrumentations } = require('@opentelemetry/instrumentation');
//const { NodeTracerProvider } = require('@opentelemetry/sdk-trace-node');
const { Resource } = require('@opentelemetry/resources');
const { SemanticResourceAttributes } = require('@opentelemetry/semantic-conventions');
//const { HttpInstrumentation } = require('@opentelemetry/instrumentation-http');
const { BatchSpanProcessor } = require("@opentelemetry/sdk-trace-base");
const { diag, DiagConsoleLogger, DiagLogLevel } = require('@opentelemetry/api');
//const { JaegerExporter } = require("@opentelemetry/exporter-jaeger");
const { OTLPTraceExporter } =  require('@opentelemetry/exporter-trace-otlp-grpc');
const { digmaAttributes } = require('@digma/otel-js-instrumentation');
const config = require('config');

// For troubleshooting, set the log level to DiagLogLevel.DEBUG
diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.INFO);
const otelEndpoint = config.get('otel.endpoint');
// const options = {
//   endpoint: 'http://localhost:14268/api/traces',
// }
//const exporter = new JaegerExporter(options);

const exporter = new OTLPTraceExporter({
  // optional - url default value is http://localhost:4318/v1/traces
  url: otelEndpoint,

  // optional - collection of custom headers to be sent with each request, empty by default
 // headers: {}, 
});
console.log(__dirname)
const sdk = new opentelemetry.NodeSDK({
  resource:new Resource({

    [SemanticResourceAttributes.SERVICE_NAME]: "user-service", // process.env.SERVICE_NAME,
    ...digmaAttributes({ rootPath: __dirname })
  }),
  spanProcessor:new BatchSpanProcessor(exporter),
  instrumentations: [getNodeAutoInstrumentations()]//new HttpInstrumentation()
});

// initialize the SDK and register with the OpenTelemetry API
// this enables the API to record telemetry
sdk.start()
  .then(() => console.log('Tracing initialized'))
  .catch((error) => console.log('Error initializing tracing', error));




module.exports = sdk;
