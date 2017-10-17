'use strict';

const joi = require('joi');

const schema = {
  id: joi.string().min(1)
    .description('The id of this link'),

  key: joi.string().alphanum().min(1)
    .description('The key used to access this file/folder'),

  name: joi.string().min(1)
    .description('A name for this link'),

  path: joi.string().min(1)
    .description('The path to the file/folder'),

  downloadCount: joi.number().min(0).default(0)
    .description('How many times this file/folder has been downloaded'),

  downloadLimit: joi.number().min(0).default(0, 'no limit')
    .description('How many times this file/folder can be downloaded before it stops working'),

  expirationDate: joi.date().min('now')
    .description('A date/time for this link to stop working'),
};

module.exports = {
  schema,

  post: {
    id: schema.id.forbidden(),
    key: schema.key.required(),
    name: schema.name.required(),
    path: schema.path.required(),
    downloadCount: schema.downloadCount.forbidden(),
    downloadLimit: schema.downloadLimit.optional(),
    expirationDate: schema.expirationDate.optional(),
  },

  put: {
    id: schema.id.forbidden(),
    key: schema.key,
    name: schema.name,
    path: schema.path,
    downloadCount: schema.downloadCount.forbidden(),
    downloadLimit: schema.downloadLimit,
    expirationDate: schema.expirationDate,
  },

  get: joi.array().items(schema),
};

