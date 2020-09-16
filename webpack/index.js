const env = process.env.NODE_ENV;
const common = require('./common.config');
const dev = require('./dev.config');
const {
  merge
} = require('webpack-merge');

let config;

switch (env) {
  case 'development':
    config = merge(common, dev);
    break;
  default:
    config = merge(common, dev);
    break;
}

module.exports = config;