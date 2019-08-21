const errorCodes = require('./codes');

class ValidationError extends Error {
  constructor(message) {
    super(message);

    this.status = 400;
    this._errorObject = {
      ...errorCodes.VALIDATION.DEFAULT
    };

    if (typeof message === 'string') {
      Object.assign(this._errorObject, {message});
    } else {
      this._errorObject = {
        ...this._errorObject,
        ...message
      };
    }

    Error.captureStackTrace(this, this.constructor);
  }

  toObject() {
    return this._errorObject;
  }
}

module.exports = ValidationError;
