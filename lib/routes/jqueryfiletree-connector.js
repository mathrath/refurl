'use strict';

const path = require('path');
const fs = require('fs');
const boom = require('boom');
const pathIsInside = require('path-is-inside');

const config = require('../config');
const db = require('../database');

module.exports = function connectorHandler(request, reply) {
  const rootPath = path.resolve(config.rootPath);
  const fullPath = path.resolve(path.join(rootPath, request.payload.dir));

  // If a key was provided, find the link it corresponds to
  var link;
  if (request.params.key) {
    link = db.getLink(request.params.key);
    if (!link) return reply(boom.notFound());
  }

  // Verify that the path is in the link's path if a link key was given
  if (link && !pathIsInside(fullPath, path.join(rootPath, link.path))) {
    return reply(boom.badRequest());
  }

  // Verify that the path is in the rootPath
  if (!pathIsInside(fullPath, rootPath)) {
    return reply(boom.badRequest());
  }

  const dirContents = fs.readdirSync(fullPath);

  const response = [];
  response.push('<ul class="jqueryFileTree" style="display: none;">');

  dirContents.forEach(each => {
    const eachPath = path.join(fullPath, each);
    if (fs.lstatSync(eachPath).isDirectory()) {
      response.push(`<li class="directory collapsed"><a href="#" rel="${eachPath}">${each}</a></li>`);
    } else {
      const extension = path.extname(each);
      response.push(`<li class="file ext_${extension}"><a href="#" rel="${eachPath}">${each}</a></li>`);
    }
  });

  response.push("</ul>");

  return reply(response.join('\n'));
};

