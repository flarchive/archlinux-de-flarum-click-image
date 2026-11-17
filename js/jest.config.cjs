const config = require('@flarum/jest-config')();

config.moduleNameMapper['\\.css$'] = '<rootDir>/tests/fixtures/style.js';

module.exports = config;
