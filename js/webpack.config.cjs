const config = require('flarum-webpack-config')();

config.module.rules.push({
  test: /\.css$/,
  type: 'asset/source',
});

module.exports = config;
