'use strict';

var BinWrapper = require('bin-wrapper');
var path = require('path');
var pkg = require('../package.json');

/**
 * Variables
 */

var BIN_VERSION = '3.0';
var BASE_URL = 'https://raw.github.com/imagemin/mozjpeg-bin/v' + pkg.version + '/vendor/';

/**
 * Initialize a new BinWrapper
 */

var bin = new BinWrapper({ global: false, progress: false })
	.src(BASE_URL + 'osx/cjpeg', 'darwin')
	.src(BASE_URL + 'linux/cjpeg', 'linux')
	.src(BASE_URL + 'win/cjpeg.exe', 'win32')
	.dest(path.join(__dirname, '../vendor'))
	.use(process.platform === 'win32' ? 'cjpeg.exe' : 'cjpeg');

/**
 * Module exports
 */

module.exports = bin;
module.exports.v = BIN_VERSION;
