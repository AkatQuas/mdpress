const path = require('path');
const fs = require('fs-extra');

module.exports.resolve = path.resolve;
module.exports.resolveRoot = (...dir) => path.resolve(__dirname, '..', ...dir);

module.exports.fs = fs;