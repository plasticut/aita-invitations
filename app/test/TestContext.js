const {factory, MongooseAdapter} = require('factory-girl');
const supertest = require('supertest');
const t = require('tap');
const mongoose = require('../libs/mongoose');
const app = require('../app');
const seeders = require('./seeders');

const tearDownPromises = [];

t.tearDown(async () => {
  await Promise.all(tearDownPromises);
  await mongoose.connection.close();
});

class TestContext {
  constructor() {
    this.factory = new factory.FactoryGirl();
    this.factory.setAdapter(new MongooseAdapter());

    seeders.forEach((defineSeeder) => defineSeeder(this.factory));

    this._request = supertest.agent(app.callback());
    this.users = [];
    this.tokens = new WeakMap();
  }

  /**
   * Destroys instance with created models
   * @async
   * @return {Promise<void>}
   */
  async destroy() {
    this.users = null;
    this.tokens = null;
    return this.factory.cleanUp();
  }

  /**
   * Creates persistent model instance
   * @async
   * @param {String} modelName - Model name
   * @param {Object} [attrs] - Model attributes
   * @param {Object} [options] - Build options
   * @return {Promise<Model>} - Model
   */
  async createOne(modelName, attrs, options) {
    return this.factory.create(modelName, attrs, options);
  }

  /**
   * Creates an array of model instances
   * @async
   * @param {String} modelName - Model name
   * @param {Number} count - Count of models instances
   * @param {Object} attrs - Model attributes
   * @param {Object} options - Build options
   * @return {Promise<[Model]>} - Array of models
   */
  async createMany(modelName, count, attrs, options) {
    return this.factory.createMany(modelName, count, attrs, options);
  }

  /**
   * Creates instance of TestContext
   * @static
   * @async
   * @param {Object} options - Options
   * @return {Promise<TestContext>}
   */
  static async createTestContext(options) {
    const ctx = new TestContext();

    tearDownPromises.push(new Promise((resolve, reject) => {
      t.tearDown(() => ctx.destroy().then(resolve).catch(reject));
    }));

    try {
      await mongoose.waitConnection();

      await TestContext.createMocks(options);
    } catch (error) {
      ctx.destroy();

      throw error;
    }

    return ctx;
  }

  static async createMocks(options) {
  };

  /**
   * @typedef {import("supertest").Test} Test
   */

  /**
   * Application json request
   * @param {string} method - http method name
   * @param {string} url - url
   * @return {Test} SuperTest request
   */
  request(method, url) {
    return this.requestSimple(method, url)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/);
  }

  /**
   * Application request
   * @param {string} method - http method name
   * @param {string} url - url
   * @return {Test} SuperTest request
   */
  requestSimple(method, url) {
    return this._request[method.toLowerCase()](url);
  }
}

module.exports = TestContext;
