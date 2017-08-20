'use strict';

const db = require('../database');

function getHandler(request, reply) {
  return reply(db.getLinks());
}

function postHandler(request, reply) {
  return reply(db.createLink(request.payload));
}

function putHandler(request, reply) {
  return reply(db.updateLink(request.params.id, request.payload));
}

function deleteHandler(request, reply) {
  return reply(db.deleteLink(request.params.id));
}

module.exports = {
  getHandler,
  postHandler,
  putHandler,
  deleteHandler,
};
