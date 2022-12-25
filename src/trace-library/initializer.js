const { diag, DiagConsoleLogger, DiagLogLevel } = require('@opentelemetry/api');

function initializeLogger() {
  diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.INFO);
}

module.exports = {
  initializeLogger,
};
