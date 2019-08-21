const config = require('config');
const Koa = require('koa');
const cors = require('@koa/cors');
const helmet = require('koa-helmet');
const swagger = require('swagger2');
const swaggerKoa = require('swagger2-koa');
const koaBodyParser = require('koa-bodyparser');

const errorMiddleware = require('./middlewares/error.middleware');
const pagesRouter = require('./pages');
const apiRouter = require('./api');

const swaggerDocument = swagger.loadDocumentSync(`${__dirname}/swagger.yml`);

if (!swagger.validateDocument(swaggerDocument)) {
  throw Error(`./swagger.yml does not conform to the Swagger 2.0 schema`);
}

const app = new Koa();

app.use(cors());

if (config.util.getEnv('NODE_ENV') === 'development') {
  // eslint-disable-next-line global-require
  app.use(require('koa-logger')());
}

app.use(helmet());
app.use(koaBodyParser());

app.use(swaggerKoa.ui(swaggerDocument, '/swagger'));
app.use(swaggerKoa.validate(swaggerDocument));

app.use(errorMiddleware);
app.use(pagesRouter.routes());
app.use(apiRouter.routes());

module.exports = app;
