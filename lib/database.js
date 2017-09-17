'use strict';

const uuid = require('uuid/v4');
const lowdb = require('lowdb');

const db = lowdb('./config/db.json');

db.defaults({ links: [] })
  .write();

function getLinks() {
  removeExpired();
  return db.get('links').value();
}

function getLink(key) {
  removeExpired();
  return db.get('links')
    .find({ key })
    .value();
}

function createLink(newLink) {
  newLink.id = uuid();
  newLink.downloadCount = 0;

  return db.get('links')
    .push(newLink)
    .last()
    .write();
}

function updateLink(id, updatedFields) {
  return db.get('links')
    .find({ id })
    .assign(updatedFields)
    .write();
}

function deleteLink(id) {
  return db.get('links')
    .remove({ id })
    .write();
}

function incrementDownloadCounter(link) {
  return db.get('links')
    .find({ id: link.id })
    .assign({ downloadCount: link.downloadCount + 1 })
    .write();
}

function removeExpired(links) {
  return db.get('links')
    .remove(isExpired)
    .write();
}

function isExpired(link) {
  if (link.downloadLimit > 0 && link.downloadCount >= link.downloadLimit) {
    return true;
  }

  if (new Date() > new Date(link.expirationDate)) {
    return true;
  }

  return false;
}

module.exports = {
  getLink,
  getLinks,
  createLink,
  updateLink,
  deleteLink,
  incrementDownloadCounter,
};
