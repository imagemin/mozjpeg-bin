'use strict';

var BinWrapper = require('bin-wrapper');
var path = require('path');
var pkg = require('../package.json');

/**
 * Variables
 */

var BIN_VERSION = '2.1';
var BASE_URL = 'https://raw.github.com/imagemin/mozjpeg-bin/v' + pkg.version + '/vendor/';

/**
 * Initialize a new BinWrapper
 */

var bin = new BinWrapper({ global: false, progress: false })
	.src(BASE_URL + 'osx/jpegtran', 'darwin')
	.src(BASE_URL + 'linux/jpegtran', 'linux')
	.src(BASE_URL + 'win/jpegtran.exe', 'win32')
	.dest(path.join(__dirname, '../vendor'))
	.use(process.platform === 'win32' ? 'jpegtran.exe' : 'jpegtran');

/**
 * Module exports
 */

module.exports = bin;
module.exports.v = BIN_VERSION;
