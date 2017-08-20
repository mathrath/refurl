'use strict';

const db = require('../database');
const config = require('../config');
const path = require('path');
const fs = require('fs');
const prettysize = require('filesize');
const foldersize = require('get-folder-size');

function filesizeHandler(request, reply) {
  let link = db.getLink(request.params.key);

  if (!link) {
    return reply(boom.notFound());
  } else if (link.length) {  // If there are multiple, go with the first
    link = link[0];
  }

  // TODO check that what we're getting the size of is actually in the rootPath
  const fullPath = path.join(config.rootPath, request.query.subpath || link.path);
  const stat = fs.statSync(fullPath);

  if (stat.isDirectory()) {
    foldersize(fullPath, (err, size) => {
      if (err) throw err;
      return reply({
        size: `${prettysize(size)} uncompressed`
      });
    });
  } else {
    return reply({
      size: prettysize(stat.size)
    });
  }
}

module.exports = {
  filesizeHandler,
};
