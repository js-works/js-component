'use strict';

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./dist/cjs/js-component.production.js');
} else {
  module.exports = require('./dist/cjs/js-component.development.js');
}
