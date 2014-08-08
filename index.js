'use strict';

var BinBuild = require('bin-build');
var BinWrapper = require('bin-wrapper');
var fs = require('fs');
var logSymbols = require('log-symbols');
var path = require('path');

/**
 * Variables
 */

var BIN_VERSION = '1.0.1';

/**
 * Initialize a new BinWrapper
 */

var bin = new BinWrapper ({ global: false })
    .dest(path.join(__dirname, 'vendor'))
    .use('jpegtran');

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
