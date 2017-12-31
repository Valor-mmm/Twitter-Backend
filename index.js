'use strict';

const Hapi = require('hapi');
const logger = require('simple-node-logger').createSimpleLogger();

const options = {
  port: process.env.PORT || 4000
};

const server = Hapi.server(options);

async function startServer() {

  try {
    //await server.register();
    require('./app/models/db');
    await server.start();
    await server.route(require('./api_routes'));
    logger.info(`Server successfully started at port: ${options.port}`);
  } catch(e) {
    logger.error('Failed to initialize and start Hapi server', e);
  }
}

startServer();