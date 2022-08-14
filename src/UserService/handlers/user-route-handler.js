const opentelemetry = require("@opentelemetry/api");
const db = require('./queries')
const errorfuncs = require("./errors-example");
var globalTracer = require("./utils")
const version = "0.0.1", instrumentationName = "userRouteHandler";
console.log(__dirname)

const trace = opentelemetry.trace.getTracer(
  instrumentationName,
  version);

const exceptionHandler = (response, span, exc, returnMessage = "internal server error") => {
  span.recordException(exc);
  span.setStatus({ code: opentelemetry.SpanStatusCode.ERROR, message: exc.message });
  response.status(500).json({
    error: true,
    message: returnMessage,
  });
}
class UserRouteHandler {
  async createUserRouteHandler(request, response) {
    console.log(request.body);
    const spanName = 'create user' // discover spanName from variable
    return trace.startActiveSpan(spanName, async (span) => {
      try {
        const { id, name } = request.body;
        if (name === '') {
          span.setStatus({ code: opentelemetry.SpanStatusCode.ERROR, message: 'UserName is empty' });
          response.status(400).json({
            error: true,
            message: "UserName is empty",
          });
          return;
        };
        var addedId = await db.createUser(id, name);
        response.status(200).json({
          error: false,
          details: `user added ${addedId}`,
        });
        return addedId;
      } catch (exc) {
        exceptionHandler(response, span, exc);
      }
      finally {
        span.end();
      }

    });



  }

  async getUsersRouteHandler(request, response) {

    const users = await globalTracer.startActiveSpan('get users', async span => { //discover globalTracer defined in a different file
      try {
        return await db.getUsers()
      } catch (exc) {
        exceptionHandler(response, span, exc);
      }
      finally {
        span.end()
      }

      return []
    });
    response.status(200).json({
      error: false,
      details: users,
    });

  }

  async error(request, response) {
    await trace.startActiveSpan('error', async span => {
      try {
        errorfuncs.doAthing();
        response.status(200).json({
          error: false,
          details: 'ok',
        });
      } catch (exc) {
        span.recordException(exc);
        span.setStatus({ code: opentelemetry.SpanStatusCode.ERROR, message: exc.message });
        response.status(500).json({
          error: true,
          message: exc.message,
        });
      }
      finally {
        span.end()
      }
    });
  }
}

module.exports = new UserRouteHandler();
