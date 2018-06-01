'use strict';

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./dist/cjs/js-widgets.production.js');
} else {
  module.exports = require('./dist/cjs/js-widgets.development.js');
}
