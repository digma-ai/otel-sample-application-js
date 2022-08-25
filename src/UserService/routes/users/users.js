var express = require('express');
const handlers = require('./handlers'),
    opentelemetry = require("@opentelemetry/api"),
    digmaExpresIns = require('../../../../../digma-instrumentation-express/out');

const router = express.Router();
// router.use(function (req, res, next) {
//     console.log(req.route);
//     const span = opentelemetry.trace.getSpan(opentelemetry.context.active());
//     span.setAttribute("digma", "router");
//     next();
// })
// base route: /users 

router.use((req, res, next) => {
    console.log("my middleware1 - before");
    next();
    console.log("my middleware1 - after");
});
router.use((req, res, next) => {
    console.log("my middleware2 - before");
    next();
    console.log("my middleware2 - after");
});
digmaExpresIns.useDigmaRouterMiddleware(router);
router.post('/', handlers.createUserRouteHandler);
router.get('/', handlers.getUsersRouteHandler);
router.get('/:userId', handlers.getUserRouteHandler);
router.get('/error', handlers.error);




// for (const stack of router.stack.filter(s=>s.route)) {
//     //const match = stack.route.stack.find(s => s.route.path === stack.route.path && s.route.methods[stack.route.method])

//     console.log();
// }
module.exports = router;