const _ = require('lodash');
const mongoose = require('mongoose');
const ValidationError = require('../errors/ValidationError');

const {ObjectId} = mongoose.Types;

module.exports = {
  checkAvalableFields,
  checkRequiredField,
  checkRequiredOneOfField,
  checkArrayOfStringField,
  checkArrayOfObjectIdField,
  checkObjectIdField,
  checkArrayOfObjects,
  checkStringField,
  checkBooleanField,
  checkIntegerField,
  checkEnumField
};

function checkAvalableFields(object, availableFields, path) {
  for (const field in object) {
    if (!availableFields.includes(field)) {
      throw new ValidationError(`Unknown field: '${[...path ? [path] : [], field].join('.')}'`);
    }
  }
}

function checkRequiredField(object, field) {
  const value = _.get(object, field);

  if (typeof value === 'undefined') {
    throw new ValidationError(`Field '${field}' required`);
  }
}

function checkArrayOfStringField(object, field) {
  const value = _.get(object, field);

  if (typeof value === 'undefined') {
    return;
  }

  if (!Array.isArray(value) || value.some((item) => typeof item !== 'string')) {
    throw new ValidationError(`Field '${field}' must be array of strings`);
  }
}

function checkArrayOfObjectIdField(object, field) {
  const value = _.get(object, field);

  if (typeof value === 'undefined') {
    return;
  }

  if (!Array.isArray(value) || value.some((item) => !ObjectId.isValid(String(item)))) {
    throw new ValidationError(`Field '${field}' must be array of valid object ids`);
  }
}

function checkObjectIdField(object, field) {
  const value = _.get(object, field);

  if (typeof value === 'undefined') {
    return;
  }

  if (!ObjectId.isValid(String(value))) {
    throw new ValidationError(`Field '${field}' must be a valid ObjectId`);
  }
}

function checkArrayOfObjects(object, field) {
  const value = _.get(object, field);

  if (typeof value === 'undefined') {
    return;
  }

  if (!Array.isArray(value)) {
    throw new ValidationError(`Field '${field}' must be array of objects`);
  }
}

function checkStringField(object, field) {
  const value = _.get(object, field);

  if (typeof value === 'undefined') {
    return;
  }

  if (typeof value !== 'string') {
    throw new ValidationError(`Field '${field}' must be string`);
  }
}

function checkRequiredOneOfField(object, fields) {
  const count = Object.keys(object).filter((key) => fields.includes(key)).length;

  if (count !== 1) {
    throw new ValidationError(`One of '${fields}' fields is required`);
  }
}

function checkEnumField(object, field, validValues) {
  const value = _.get(object, field);

  if (typeof value === 'undefined') {
    return;
  }

  if (!validValues.includes(value)) {
    throw new ValidationError(`Field '${field}' must have value one of ${validValues.join('|')}`);
  }
}

function checkIntegerField(object, field, {min, max} = {}) {
  let value = object[field];

  if (typeof value === 'undefined') {
    return;
  }

  value = Number(value);

  if (Number.isInteger(value) === false) {
    throw new ValidationError(`Field '${field}' must be an integer`);
  }

  if (typeof min === 'number' && value < min) {
    throw new ValidationError(`Field '${field}' must be greater or equal than ${min}`);
  }

  if (typeof max === 'number' && max < value) {
    throw new ValidationError(`Field '${field}' must be less or equal than ${max}`);
  }
}

function checkBooleanField(object, field) {
  const value = _.get(object, field);
  const type = typeof value;

  if (type === 'undefined') {
    return;
  }

  if (type !== 'boolean') {
    throw new ValidationError(`Field '${field}' must be a boolean`);
  }
}
