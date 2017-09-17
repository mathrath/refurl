const lowdb = require('lowdb');
const db = lowdb('./config/config.json');

db.defaults({
  rootPath: '.',
  baseURL: 'myurl.com',
  auth: {
    user: 'admin',
    password: 'changeme',
  },
}).write();

// TODO check config for problems

module.exports = db.value();

