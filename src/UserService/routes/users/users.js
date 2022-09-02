const express = require('express');
const handlers = require('./handlers');
const { useDigmaRouterMiddleware } = require('@digma/instrumentation-express');

const router = express.Router();

useDigmaRouterMiddleware(router);

router.post('/', handlers.createUserRouteHandler);
router.get('/', handlers.getUsersRouteHandler);
router.get('/:userId', handlers.getUserRouteHandler);
router.get('/error', handlers.error);


module.exports = router;