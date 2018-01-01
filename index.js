'use strict';

const Hapi = require('hapi');
const logger = require('simple-node-logger').createSimpleLogger();

const authUtils = require('./app/api/auth-utils');

const options = {
  port: process.env.PORT || 4000
};

const server = Hapi.server(options);

const jwtConfig = authUtils.getJwtConfig();
const authJwtOptions = {
  verifyJWT: true,
  keychain: [jwtConfig.password],
  validate: authUtils.validate,
  verifyOptions: {algorithms: [jwtConfig.algorithm]}
};

async function startServer() {

  try {
    const jwtPlugin = require('@now-ims/hapi-now-auth');
    await server.register({
      plugin: jwtPlugin
    });
    require('./app/models/db');
    server.auth.strategy('jwt-strategy', 'hapi-now-auth', authJwtOptions);
    server.auth.default('jwt-strategy');
    await server.start();
    await server.route(require('./api_routes'));
    logger.info(`Server successfully started at port: ${options.port}`);
  } catch(e) {
    logger.error('Failed to initialize and start Hapi server', e);
  }
}

startServer();