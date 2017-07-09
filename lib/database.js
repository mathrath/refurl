'use strict';

const uuid = require('uuid/v4');
const lowdb = require('lowdb');

const db = lowdb('db.json');

db.defaults({ links: [] })
  .write();

function getLinks() {
  return db.get('links').value();
}

function getLink(key) {
  return db.get('links')
    .find({ key })
    .value();
}

function createLink(fields) {
  const newLink = {
    id: uuid(),
    key: fields.key,
    name: fields.name,
    path: fields.path,
  };

  // TODO check the new link for problems

  return db.get('links')
    .push(newLink)
    .last()
    .write()
}

function updateLink(id, fields) {
  const updatedFields = {};

  if (fields.key) updatedFields.key = fields.key;
  if (fields.name) updatedFields.name = fields.name;
  if (fields.path) updatedFields.path = fields.path;

  // TODO check the updated fields for problems

  return db.get('links')
    .find({ id })
    .assign(updatedFields)
    .write();
}

function deleteLink(id) {
  return db.get('links')
    .remove({ id })
    .write()
}

module.exports = {
  getLink,
  getLinks,
  createLink,
  updateLink,
  deleteLink,
};
