'use strict';

const hapi = require('hapi');

const links = require('./lib/links');

const server = new hapi.Server();
server.connection({
  port: process.env.PORT || 8000,
});

server.route({
  method: 'POST',
  path: '/refurl/links',
  handler: links.postHandler,
});

server.route({
  method: 'GET',
  path: '/refurl/links',
  handler: links.getHandler,
});

server.route({
  method: 'DELETE',
  path: '/refurl/links',
  handler: links.deleteHandler,
});

server.start(err => {
  if (err) {
    throw err;
  }

  console.log('Server running at:', server.info.uri);
});
