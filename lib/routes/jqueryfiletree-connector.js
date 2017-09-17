'use strict';

const path = require('path');
const fs = require('fs');
const boom = require('boom');
const pathIsInside = require('path-is-inside');

const config = require('../config');
const db = require('../database');

module.exports = function connectorHandler(request, reply) {
  // If a key was provided, find the link it corresponds to
  let link;
  if (request.params.key) {
    link = db.getLink(decodeURIComponent(request.params.key));
    if (Array.isArray(link)) link = link[0];
    if (!link) return reply(boom.notFound());
  }

  const rootPath = path.resolve(config.rootPath);
  const contextPath = link ? path.resolve(path.join(rootPath, link.path)) : rootPath;
  const fullPath = path.resolve(path.join(rootPath, decodeURIComponent(request.payload.dir)));

  // Verify that the path is in the link's path if a link key was given
  if (!pathIsInside(fullPath, contextPath)) {
    return reply(boom.badRequest());
  }

  const dirContents = fs.readdirSync(fullPath);

  const response = [];
  response.push('<ul class="jqueryFileTree" style="display: none;">');

  dirContents.forEach(each => {
    const eachAbsolutePath = path.resolve(path.join(fullPath, each));
    const eachRelativePath = path.relative(contextPath, eachAbsolutePath);

    if (fs.lstatSync(eachAbsolutePath).isDirectory()) {
      response.push(`<li class="directory collapsed"><a href="#" rel="${eachRelativePath}">${each}</a></li>`);
    } else {
      const extension = path.extname(each);
      response.push(`<li class="file ext_${extension}"><a href="#" rel="${eachRelativePath}">${each}</a></li>`);
    }
  });

  response.push("</ul>");

  return reply(response.join('\n'));
};

