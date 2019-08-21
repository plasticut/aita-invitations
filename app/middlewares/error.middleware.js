const config = require('config');

const logger = require('../libs/logger')(module);

module.exports = errorMiddleware;

async function errorMiddleware(ctx, next) {
  try {
    await next();

    const status = ctx.status || 404;
    if (status === 404) {
      ctx.throw(404);
    }
  } catch (err) {
    ctx.status = err.status || 500;

    if (err.toObject) {
      ctx.status = err.status;
      ctx.body = {
        error: err.toObject()
      };
      return;
    }

    logger.error(err);
  }
}
