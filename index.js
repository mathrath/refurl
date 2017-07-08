'use strict';

const hapi = require('hapi');

const links = require('./lib/links');

const server = new hapi.Server();
server.connection({
  port: process.env.PORT || 8000,
});
server.register(require('inert'));

server.route({
  method: 'GET',
  path: '/refurl/api/links',
  handler: links.getHandler,
});

server.route({
  method: 'POST',
  path: '/refurl/api/links',
  handler: links.postHandler,
});

server.route({
  method: 'PUT',
  path: '/refurl/api/links/{id}',
  handler: links.putHandler,
});

server.route({
  method: 'DELETE',
  path: '/refurl/api/links/{id}',
  handler: links.deleteHandler,
});

server.route({
  method: 'GET',
  path: '/refurl/manage',
  handler: (request, reply) => {
    reply.file('./templates/manage.html');
  }
});

// Set up components
server.route({
  method: 'GET',
  path: '/refurl/components/bootstrap/{param*}',
  handler: {
    directory: {
      path: __dirname + '/node_modules/bootstrap/dist'
    }
  }
});

server.route({
  method: 'GET',
  path: '/refurl/components/jquery/{param*}',
  handler: {
    directory: {
      path: __dirname + '/node_modules/jquery/dist'
    }
  }
});


server.start(err => {
  if (err) {
    throw err;
  }

  console.log('Server running at:', server.info.uri);
});
