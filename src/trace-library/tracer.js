const opentelemetry = require("@opentelemetry/api");

const userServiceTracer = opentelemetry.trace.getTracer("UserService");
const globalTracer = opentelemetry.trace.getTracer("UserService");

module.exports = {
  userServiceTracer,  
  globalTracer,
};
