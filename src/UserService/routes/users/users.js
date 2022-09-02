const express = require('express');
const handlers = require('./handlers');
const digmaExpresIns = require('@digma/instrumentation-express');

const router = express.Router();

digmaExpresIns.useDigmaRouterMiddleware(router);

router.post('/', handlers.createUserRouteHandler);
router.get('/', handlers.getUsersRouteHandler);
router.get('/:userId', handlers.getUserRouteHandler);
router.get('/error', handlers.error);


module.exports = router;