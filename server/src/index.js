const database = require('./models');
const wait = setInterval(() => {
  if (database.isDBConnected()) {
    clearInterval(wait);

    // const { Server } = require('socket.io');
    const app = require('./app');
    const config = require('./config/config');
    const logger = require('./config/logger');
    const { Redis } = require('./services/redis.service')

    const server = app.listen(config.port, async () => {
      try {
        logger.info(`HTTP Server start on port: ${config.port}`);

        // Connect Redis
        const redis = new Redis(config.redis)
        await redis.Connect()
        global.redis = redis
        logger.info(`Redis connected: ${config.redis.url}`);

        // Start caching
        redis.StartCacheService()

      } catch (e) {
        logger.info(e);
      }
    });

    const exitHandler = () => {
      if (server) {
        server.close(() => {
          logger.info('Server closed');
          process.exit(1);
        });
      } else {
        process.exit(1);
      }
    };

    const unexpectedErrorHandler = (error) => {
      logger.error(error);
      exitHandler();
    };

    process.on('uncaughtException', unexpectedErrorHandler);
    process.on('unhandledRejection', unexpectedErrorHandler);

    process.on('SIGTERM', () => {
      logger.info('SIGTERM received');
      if (server) {
        server.close();
      }
    });
  } else {
    console.log('Waiting for database connection');
  }
}, 200)
