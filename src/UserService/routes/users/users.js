const express = require('express');
const { useDigmaRouterMiddleware } = require('@digma/instrumentation-express');
const handlers = require('./handlers');

const router = express.Router();

useDigmaRouterMiddleware(router);

router.post('/', handlers.createUserRouteHandler);
router.get('/', handlers.getUsersRouteHandler);
router.get('/handled-error', handlers.handledError);
router.get('/unhandled-error', handlers.unhandledError);
router.get('/:userId', handlers.getUserRouteHandler);


module.exports = router;