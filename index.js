'use strict';

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./dist/cjs/js-reactify.production.js');
} else {
  module.exports = require('./dist/cjs/js-reactify.development.js');
}
