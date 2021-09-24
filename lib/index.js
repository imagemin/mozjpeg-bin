'use strict';
const path = require('path');
const BinWrapper = require('bin-wrapper');
const pkg = require('../package.json');

const GITHUB_RAW_URL = process.env.GITHUB_RAW_URL ? process.env.GITHUB_RAW_URL : 'https://raw.githubusercontent.com'
const url = `${GITHUB_RAW_URL}/imagemin/mozjpeg-bin/v${pkg.version}/vendor/`;

module.exports = new BinWrapper()
	.src(`${url}macos/cjpeg`, 'darwin')
	.src(`${url}linux/cjpeg`, 'linux')
	.src(`${url}win/cjpeg.exe`, 'win32')
	.dest(path.join(__dirname, '../vendor'))
	.use(process.platform === 'win32' ? 'cjpeg.exe' : 'cjpeg');
