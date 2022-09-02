const express = require('express');
const handlers = require('./handlers');
const opentelemetry = require('@opentelemetry/api');
const digmaExpresIns = require('@digma/instrumentation-express');

const router = express.Router();


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


module.exports = router;