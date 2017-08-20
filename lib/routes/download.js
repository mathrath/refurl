'use strict';

const boom = require('boom');
const fs = require('fs');
const path = require('path');
const archiver = require('archiver');
const pathIsInside = require('path-is-inside');

const db = require('../database');
const config = require('../config');

function pageHandler(request, reply) {
  let link = db.getLink(request.params.key);

  if (!link) {
    return reply(boom.notFound());
  } else if (link.length) {  // If there are multiple, go with the first
    link = link[0];
  }

  reply.view('download', {
    key: link.key,
    name: link.name,
    path: link.path,
    isDir: fs.lstatSync(path.join(config.rootPath, link.path)).isDirectory(),
  });
}

function downloadHandler(request, reply) {
  let link = db.getLink(request.params.key);

  if (!link) {
    return reply(boom.notFound());
  } else if (link.length) {  // If there are multiple, go with the first
    link = link[0];
  }

  const rootPath = path.resolve(config.rootPath);
  const contextPath = path.resolve(path.join(rootPath, link.path));
  const fullPath = request.query.subpath ? path.resolve(path.join(contextPath, request.query.subpath)) : contextPath;

  // Verify that the path is in the link's path
  if (!pathIsInside(fullPath, contextPath)) {
    return reply(boom.badRequest());
  }

  // Verify that the path is in the rootPath
  if (!pathIsInside(fullPath, rootPath)) {
    return reply(boom.badRequest());
  }

  if (fs.lstatSync(fullPath).isDirectory()) {
    const archive = archiver('zip');

    archive.on('warning', err => {
      // TODO do more about this error
      console.log(err);
    });

    archive.directory(fullPath, false);
    archive.finalize();

    const zipName = `${path.basename(fullPath)}.zip`;
    reply(archive).header('content-disposition', `attachment; filename=${zipName};`);
  } else {
    reply.file(fullPath, {
      confine: false,
      mode: 'attachment'
    });
  }

  // Increment the download counter
  // TODO can this be done after the download is complete?
  db.incrementDownloadCounter(link);
}

module.exports = {
  downloadHandler,
  pageHandler,
};
