const express = require('express');
const { digmaRouteHandler } = require('@digma/instrumentation-express');
const handlers = require('./handlers');

const router = express.Router();

router.use(digmaRouteHandler);

router.post('/', handlers.createUserRouteHandler);
router.get('/', handlers.getUsersRouteHandler);
router.get('/error', handlers.error);
router.get('/error-unhandled', handlers.unhandledError);
router.get('/error-uncaught', handlers.uncaughtError);
router.get('/:userId', handlers.getUserRouteHandler);

module.exports = router;
