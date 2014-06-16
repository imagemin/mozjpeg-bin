'use strict';

var BinWrapper = require('bin-wrapper');
var path = require('path');

/**
 * Initialize a new BinWrapper
 */

var bin = new BinWrapper ({ global: false })
    .dest(path.join(__dirname, 'vendor'))
    .use('jpegtran');

/**
 * Module exports
 */

module.exports = bin;
module.exports.path = bin.use();
