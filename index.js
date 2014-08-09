'use strict';

var BinBuild = require('bin-build');
var BinWrapper = require('bin-wrapper');
var fs = require('fs');
var logSymbols = require('log-symbols');
var path = require('path');
var pkg = require('./package.json');

/**
 * Variables
 */

var BIN_VERSION = '2.1';
var BASE_URL = 'https://raw.github.com/kevva/mozjpeg/v' + pkg.version + '/vendor/';

/**
 * Initialize a new BinWrapper
 */

var bin = new BinWrapper({ global: false })
    .src(BASE_URL + 'linux/jpegtran', 'linux')
    .src(BASE_URL + 'win/jpegtran.exe', 'win32')
    .dest(path.join(__dirname, 'vendor'))
    .use(process.platform === 'win32' ? 'jpegtran.exe' : 'jpegtran');

/**
 * Only run check if binary doesn't already exist
 */

fs.exists(bin.use(), function (exists) {
    if (!exists) {
        var builder = new BinBuild()
            .src('https://github.com/mozilla/mozjpeg/archive/v' + BIN_VERSION + '.tar.gz')
            .cfg('autoreconf -fiv && ./configure --prefix="' + bin.dest() + '" --bindir="' + bin.dest() + '" --libdir="' + bin.dest() + '"')
            .make('make && make install');

        return builder.build(function (err) {
            if (err) {
                console.log(logSymbols.error, err);
            }

            console.log(logSymbols.success + ' mozjpeg built successfully!');
        });
    }
});

/**
 * Module exports
 */

module.exports.path = bin.use();
