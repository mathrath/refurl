'use strict';

const chance = require('chance')();

module.exports = function generateKey() {
  // TODO check that this key hasn't been used already
  return chance.word({ length: 8 });
}
