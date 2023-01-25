const opentelemetry = require('@opentelemetry/api');
const db = require('../../handlers/queries')
const errorfuncs = require('../../handlers/errors-example');
const { globalTracer, wrapMethodWithActiveSpan } = require('../../handlers/tracer');
const { doSomething } = require('../../handlers/wrappedfuncs');
// const { userServiceTracer, globalTracer, wrapMethodWithActiveSpan } = require('../../../trace-library/tracer');

const version = '0.0.1';
const instrumentationName = 'userRouteHandler';

console.log(__dirname)

const trace = opentelemetry.trace.getTracer(instrumentationName, version);

const exceptionHandler = (response, span, exc, returnMessage = 'internal server error') => {
  span.recordException(exc);
  span.setStatus({ code: opentelemetry.SpanStatusCode.ERROR, message: exc.message });
  response.status(500).json({ 
    error: true,
    message: returnMessage,
  });
} 

class UserRouteHandler {
  async wrappedSpanHandlerWithOptionalName(request, response) {
    // Case 1: without optional name
    const wrappedSomething = wrapMethodWithActiveSpan(doSomething);
    await wrappedSomething(1,2);

    // Case 2: with optional name
    const wrappedSomethingWithOptionalName = wrapMethodWithActiveSpan(doSomething, "myWrappedSpanName2");
    await wrappedSomethingWithOptionalName(3,4);

    // Case 3: with multiline arguments and whitespaces
    const wrappedMultiline = wrapMethodWithActiveSpan  (  
    
      doSomething  ,
      "multiline"
    
    );

    await wrappedMultiline(3,4);

    // TO DO:
    // Case 4: with optional name in variable
    // const spanName = "myWrappedSpanName3";
    // const wrappedSomethingWithOptionalNameInVariable = wrapMethodWithActiveSpan(doSomething, spanName);
    // await wrappedSomethingWithOptionalNameInVariable(5,6);
    
    response.sendStatus(200);
  }

  async createUserRouteHandler(request, response) {
    console.log('creating user:',request.body);
    const spanName = 'create user' // discover spanName from variable
    return await trace.startActiveSpan(spanName, async (span) => {
      try {
        const { id, name } = request.body;
        if (name === '') {
          span.setStatus({ code: opentelemetry.SpanStatusCode.ERROR, message: 'UserName is empty' });
          response.status(400).json({
            error: true,
            message: 'UserName is empty',
          });
          return; 
        };
        const addedId = await db.createUser(id, name);
        response.status(200).json({
          error: false,
          details: `user added ${addedId}`,
        });
        return addedId;
      } catch (exc) {
        exceptionHandler(response, span, exc);
        console.log('user creation error');
      }
      finally {
        span.end();
      }
    });
  }

  async getUserRouteHandler(request, response) {
    console.log(request.params);
    await globalTracer.startActiveSpan('get user', async span => { //discover globalTracer defined in a different file
      const userId = Number(request.params.userId);
      const user = await db.getUser(userId);
      response.status(200).json({
        error: false,
        details: user,
      });
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

  /**
   * This request handler demonstrates an "unhandled" exception.
   * 
   * Unhandled exceptions are basically exceptions that are not caught by the offending
   * code that triggered the error, so they bubble up until a global exception handler
   * can catch them and record them on the root span.
   * 
   * In this example, we simulate that behavior by grabbing a reference to the root span
   * and recording the exception directly on it. We intentionally avoid creating a new
   * span in this function to support the simulation.
   * 
   * In a real world app, the call to `rootSpan.recordException` would likely be made by
   * a global exception handler and not in the request handler.
   * 
   * @param {*} request 
   * @param {*} response 
   */
  async unhandledError(request, response) {    
    const activeContext = opentelemetry.context.active();
    const rootSpan = opentelemetry.trace.getSpan(activeContext);

    try {
      errorfuncs.throwRandomError();
      response.status(200).json({
        error: false,
        details: 'ok',
      });
    }
    catch (exc) {
      rootSpan.recordException(exc);
      rootSpan.setStatus({ code: opentelemetry.SpanStatusCode.ERROR, message: exc.message });
      response.status(500).json({
        error: true,
        message: exc.message,
      });
    }
  }

  /**
   * This request handler demonstrates the behavior with an error that isn't caught.
   * 
   * Because there is no try catch block here and no global exception handler, the
   * error generated by `errorfuncs.doAthing` will crash the process. Therefore, no
   * response will be sent to the client.
   * 
   * More importantly for our purposes, the active span will not be closed and will
   * not be exported.
   * 
   * @param {*} request 
   * @param {*} response 
   */
  async uncaughtError(request, response) {
    await trace.startActiveSpan('uncaught error', async span => {
      errorfuncs.doAthing();

      // these statements will not be reached
      response.status(200).json({
        error: false,
        details: 'ok',
      });
      
      // the span will not be closed by this request handler
      span.end()
    });
  }
}

module.exports = new UserRouteHandler();
