// Require dependencies
// const opentelemetry = require("@opentelemetry/sdk-node");
 const { getNodeAutoInstrumentations } = require("@opentelemetry/auto-instrumentations-node");
// const { diag, DiagConsoleLogger, DiagLogLevel } = require('@opentelemetry/api');
//const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-http');
//const { OTLPTraceExporter } =  require('@opentelemetry/exporter-trace-otlp-proto');

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
const { OTLPTraceExporter } =  require('@opentelemetry/exporter-trace-otlp-grpc');

//const appRoot = require('app-root-path');
const process = require('process');
const os = require("os");
const finder = require('find-package-json');
const config = require('config');

const path = require('path');
console.log(__dirname)
class SemanticResourceDigmaAttributes {
  static ENVIRONMENT = "digma.environment";
  static COMMIT_ID = "scm.commit.id";
  static PACKAGE_PATH = "code.package.path";
}
Object.freeze(SemanticResourceDigmaAttributes); 

//let packagePath = path.dirname(require.resolve("UserService/package.json"));

//var pathToModule = require.resolve('module');



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

 
function digmaAttributes(digmaEnvironment = undefined, commitId = undefined) {
  let attributes = {};
  const hostname = os.hostname();
  if(digmaEnvironment === undefined) {
      digmaEnvironment = `${hostname}[local]`
  }
  attributes[SemanticResourceAttributes.HOST_NAME] = hostname;
  attributes[SemanticResourceDigmaAttributes.ENVIRONMENT] = digmaEnvironment;
  attributes[SemanticResourceAttributes.TELEMETRY_SDK_LANGUAGE] = 'JavaScript';

  if(commitId){
    attributes[SemanticResourceDigmaAttributes.COMMIT_ID] = commitId;
  }

  const f = finder(__dirname);
  const pkg = f.next().value;
  const packagePath = require('path').dirname(pkg.__path)
  attributes[SemanticResourceAttributes.PACKAGE_PATH] = packagePath;

  return attributes
  
}

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
    ...digmaAttributes()

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




module.exports = sdk;
