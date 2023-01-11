import { diag, DiagConsoleLogger, DiagLogLevel } from '@opentelemetry/api';

export function initializeLogger() {
  diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.INFO);
}