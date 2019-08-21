class NotFoundError extends Error {
  constructor(data) {
    super();

    this.status = 404;
    this._errorObject = {
      ...data
    };

    Error.captureStackTrace(this, this.constructor);
  }

  toObject() {
    return this._errorObject;
  }
}

module.exports = NotFoundError;
