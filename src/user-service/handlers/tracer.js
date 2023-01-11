const opentelemetry = require("@opentelemetry/api");

const globalTracer = opentelemetry.trace.getTracer("UserService");

function wrapMethodWithActiveSpan(fn, customName) {
    const spanName = customName || fn.name;
    return function wrapped(...args) {
      return globalTracer.startActiveSpan(spanName, async (span) => {
        try {
          return fn(...args);
        }
        finally {
          span.end();
        }
      });
    };
}

module.exports = {globalTracer, wrappedStartSpan, wrapMethodWithActiveSpan};
