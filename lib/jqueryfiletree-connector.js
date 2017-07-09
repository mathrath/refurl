'use strict';

const path = require('path');
const fs = require('fs');

module.exports = function connectorHandler(request, reply) {
  const rootPath = '.'; // TODO need some sort of configuration system

  // TODO verify that the path is actually in the rootPath
  const fullPath = path.join(rootPath, request.payload.dir);

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

