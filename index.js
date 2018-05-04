'use strict';

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./dist/cjs/js-remix.production.js');
} else {
  module.exports = require('./dist/cjs/js-remix.development.js');
}
