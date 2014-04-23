'use strict';

var BinWrapper = require('bin-wrapper');
var chalk = require('chalk');
var fs = require('fs');
var path = require('path');

/**
 * Initialize a new BinWrapper
 */

var bin = new BinWrapper({ bin: 'jpegtran', dest: path.join(__dirname, 'vendor') });
var bs = 'autoreconf -fiv && ./configure --prefix="' + bin.dest +
         '" --bindir="' + bin.dest + '" --libdir="' + bin.dest + '" && make && make install';

/**
 * Only run check if binary doesn't already exist
 */

fs.exists(bin.path, function (exists) {
    if (!exists) {
        bin
            .addSource('https://github.com/mozilla/mozjpeg/archive/v1.0.1.tar.gz')
            .build(bs)
            .on('error', function (err) {
                return console.log(chalk.red('✗ ' + err.message));
            })
            .on('finish', function () {
                return console.log(chalk.green('✓ mozjpeg rebuilt successfully'));
            });
    }
});

/**
 * Module exports
 */

module.exports.path = bin.path;
