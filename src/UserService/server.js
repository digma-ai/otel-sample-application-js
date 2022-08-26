const express = require('express');
const users = require('./routes/users/users');
const AppConfig = require('./config/app-config');
const otelSdk = require('./tracing');
const opentelemetry = require('@opentelemetry/api');
const parseExpressApp = require('express-route-parser');
const digmaExpresIns = require('@digma/instrumentation-express');
const path = require('path');

class Server {
  constructor() {
    this.app = express();
    // users.use(function(req, res, next) {
    //   console.log(req.route);
    //   const span = opentelemetry.trace.getSpan(opentelemetry.context.active());
    //   span.setAttribute("digma", "router");
    //   next();
    // })
   //digmaExpresIns.useDigmaAppMiddleware(this.app);

    // this.app.use((req, res, next) => {
    //  // console.log(req.route);
    //   const span = opentelemetry.trace.getSpan(opentelemetry.context.active());
    //   span.setAttribute("digma", "app");
    //   next();
    //   console.log("req.route");
    // });
  }
  // getRoutesOfLayer(path, layer){
  //   if(layer.method){
  //     return [];
  //   }
  //   if(layer.route){
  //     return getRoutesOfLayer(path, layer)
  //   }
  // }

  includeRoutes() {
    this.app.use('/users', users);
    this.app.get('/health', (req, res)=>{
      res.status(200).json({
        error: false,
        details: '',
      });
    });
    // this.app.all('/', (req, res, next) => {
    //   console.log('Accessing digma middleware section ...');
    //   next(); // pass control to the next handler
    // });
   // const parsed = parseExpressApp.parseExpressApp(this.app);
   //digmaExpresIns.discover(this.app)
   //const a = digmaExpresIns.routesMap;
   // this.app._router.stack.forEach(req.bind(null, []))

    // this.app._router.stack.forEach(layer=>{
    //   if(layer.name ==='router'){
    //     const routeInServer = `${layer.regexp}`
    //     .split('\\') // Seperates the string at every '\'
    //     .slice(1, -2) // Gets rid of the first index and last two indexes (the regex)
    //     .join(''); // Puts the string back together so that all the remains is the route
    //     if(layer.handle.__original.stack){
    //       for (const subLayer of layer.handle.__original.stack) {
    //         if(subLayer.route){
    //           const path = subLayer.route.path;
    //           if(subLayer.route.stack){
    //             for (const s of subLayer.route.stack) {
    //               console.log("");
    //             }
    //           }
    //         }
            
            
    //         const routeInRouter = `${subLayer.regexp}`
    //         .split('\\') // Seperates the string at every '\'
    //         .slice(1, -1) // Gets rid of the first index and last two indexes (the regex)
    //         .join(''); // Puts the string back together so that all the remains is the route
    //       }


    //     }
        

    //   }

    //   //this.getRoutesOfLayer('', layer)
    // });
  //   for (const stack of router.stack.filter(s=>s.route)) {
  //     //const match = stack.route.stack.find(s => s.route.path === stack.route.path && s.route.methods[stack.route.method])
  
  //     console.log(route);
  // }

  }

  appConfig() {
    new AppConfig(this.app).includeConfig();
  }

  startTheServer() {
    this.appConfig();
    this.includeRoutes();

    const port = process.env.NODE_SERVER_PORT || 4000;
    const host = process.env.NODE_SERVER_HOST || '0.0.0.0';

    this.app.listen(port, host, () => {
      console.log(`Listening on http://${host}:${port}`);
    });
  }
}

const gracefulShutdown = async () => {
  console.log("otelSdk shutdown...");
  await otelSdk.shutdown();
};

process.on('SIGINT', async () => {
  console.log(`SIGINT`);
  await gracefulShutdown();
});

// gracefully shut down the SDK on process exit
process.on('SIGTERM', async () => {
  console.log(`SIGTERM`);
  await gracefulShutdown();
});

process.on('uncaughtException', async err => {
  console.log(`uncaughtException: ${err}`);
  await gracefulShutdown();
});

process.on('exit', async code => {
  console.log(`Process exited with code: ${code}`)
  await gracefulShutdown();
});

module.exports = new Server();
