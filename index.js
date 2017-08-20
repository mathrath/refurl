'use strict';

const hapi = require('hapi');
const basicAuth = require('hapi-auth-basic');

const config = require('./lib/config');
const links = require('./lib/routes/links');
const download = require('./lib/routes/download');
const filesize = require('./lib/routes/filesize');
const generateKey = require('./lib/utils/generateKey');
const jqueryfiletreeConnector = require('./lib/routes/jqueryfiletree-connector');

const server = new hapi.Server();
server.connection({
  port: process.env.PORT || 8000,
});

server.register(require('inert'));

server.register(require('vision'), err => {
  if (err) throw err;

  server.views({
    engines: {
      html: require('handlebars')
    },
    relativeTo: __dirname,
    path: 'templates'
  });
});

server.register(require('hapi-auth-basic'), (err) => {
  server.auth.strategy('simple', 'basic', { 
    validateFunc: (request, username, password, callback) => {
      if (username != config.auth.user || password != config.auth.password) {
        return callback(null, false);
      } else {
        return callback(null, true, { user: config.auth.user });
      }
    },
  });

  // Management API
  server.route({
    method: 'GET',
    path: '/refurl/api/links',
    handler: links.getHandler,
    config: { auth: 'simple' },
  });

  server.route({
    method: 'POST',
    path: '/refurl/api/links',
    handler: links.postHandler,
    config: { auth: 'simple' },
  });

  server.route({
    method: 'PUT',
    path: '/refurl/api/links/{id}',
    handler: links.putHandler,
    config: { auth: 'simple' },
  });

  server.route({
    method: 'DELETE',
    path: '/refurl/api/links/{id}',
    handler: links.deleteHandler,
    config: { auth: 'simple' },
  });

  server.route({
    method: 'GET',
    path: '/refurl/api/key',
    handler: (request, reply) => reply({ key: generateKey() }),
    config: { auth: 'simple' },
  });

  server.route({
    method: 'POST',
    path: '/refurl/api/jqueryfiletree-connector',
    handler: jqueryfiletreeConnector,
    config: { auth: 'simple' },
  });

  // Management pages
  server.route({
    method: 'GET',
    path: '/refurl/manage',
    handler: (request, reply) => {
      reply.file('./templates/manage.html');
    },
    config: { auth: 'simple' },
  });

  server.route({
    method: 'GET',
    path: '/refurl/create',
    handler: (request, reply) => {
      reply.view('create', {
        key: generateKey(),
        baseURL: config.baseURL,
      });
    },
    config: { auth: 'simple' },
  });

});

// Endpoints to access a download
server.route({
  method: 'GET',
  path: '/{key}',
  handler: download.pageHandler,
});

server.route({
  method: 'GET',
  path: '/{key}/download',
  handler: download.downloadHandler,
});

server.route({
  method: 'GET',
  path: '/{key}/filesize',
  handler: filesize.filesizeHandler,
});

server.route({
  method: 'POST',
  path: '/{key}/jqueryfiletree-connector',
  handler: jqueryfiletreeConnector,
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

server.route({
  method: 'GET',
  path: '/refurl/components/jqueryfiletree/{param*}',
  handler: {
    directory: {
      path: __dirname + '/node_modules/jqueryfiletree/dist'
    }
  }
});

server.route({
  method: 'GET',
  path: '/refurl/components/clipboard-button/{param*}',
  handler: {
    file: {
      path: __dirname + '/node_modules/clipboard-button/clipboard-button.js'
    }
  }
});

server.route({
  method: 'GET',
  path: '/refurl/components/bootstrap-datepicker/{param*}',
  handler: {
    directory: {
      path: __dirname + '/node_modules/bootstrap-datepicker/dist'
    }
  }
});


server.start(err => {
  if (err) {
    throw err;
  }

  console.log('Server running at:', server.info.uri);
});
