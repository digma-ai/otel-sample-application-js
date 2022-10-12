const { trace } = require("@opentelemetry/api");

const globalTracer = trace.getTracer("UserService");

module.exports = globalTracer;
