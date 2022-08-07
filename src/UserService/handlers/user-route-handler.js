const opentelemetry = require("@opentelemetry/api");


//var trace = undefined;
const trace =opentelemetry.trace.getTracer("userRouteHandler");

class UserRouteHandler {
 // trace = tracer.getTracer("userRouteHandler")
 
  // constructor() {
  //   this.trace = trace.getTracer("userRouteHandler")
  // }  
  async createUserRouteHandler(request, response) {
    const { userName } = request.body;
    if (userName === '') {
      response.status(400).json({
        error: true,
        message: "UserName is empty",
      })
     return;
    };

    try {
        console.log("user added")
    } catch (error) {
      response.status(CONSTANTS.SERVER_ERROR_HTTP_CODE).json({
        error: true,
        message: CONSTANTS.SERVER_ERROR_MESSAGE,
      });
    }
    
  }

  async getUsersRouteHandler(request, response) {
    try {
      const users = await trace.startActiveSpan('get users', async span => {
        try {
          await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (exc) {
          span.recordException(exc)
          span.setStatus({ code: otel.SpanStatusCode.ERROR, message: String(exc) })
          throw exc;
        } finally {
          span.end()
        }

        return []
      });

      response.status(200).json({
        error: false,
        details: users,
      });
    } catch (error) {
      response.status(500).json({
        error: true,
        message: "internal server error",
      });
    }
  }


}

module.exports = new UserRouteHandler();
