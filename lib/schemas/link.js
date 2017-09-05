'use strict';

const joi = require('joi');

const schema = {
  id: joi.string().alphanum().min(1)
    .description('The id of this link'),

  key: joi.string().alphanum().min(1)
    .description('The key used to access this file/folder'),

  name: joi.string().min(1)
    .description('A name for this link'),

  path: joi.string().min(1)
    .description('The path to the file/folder'),

  downloadCount: joi.number().min(0).default(0)
    .description('How many times this file/folder has been downloaded'),
}

module.exports = {
  schema,

  post: {
    id: schema.id.forbidden(),
    key: schema.key.required(),
    name: schema.name.required(),
    path: schema.path.required(),
    downloadCount: schema.downloadCount.forbidden(),
  },

  put: {
    id: schema.id.forbidden(),
    key: schema.key,
    name: schema.name,
    path: schema.path,
    downloadCount: schema.downloadCount.forbidden(),
  },

  get: joi.array().items(schema),
};

