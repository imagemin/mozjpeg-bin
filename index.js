'use strict';

var BinBuild = require('bin-build');
var BinWrapper = require('bin-wrapper');
var chalk = require('chalk');
var fs = require('fs');
var path = require('path');

/**
 * Initialize a new BinWrapper
 */

var bin = new BinWrapper()
    .dest(path.join(__dirname, 'vendor'))
    .use('jpegtran');

/**
 * Only run check if binary doesn't already exist
 */

fs.exists(bin.use(), function (exists) {
    if (!exists) {
        var builder = new BinBuild()
            .src('https://github.com/mozilla/mozjpeg/archive/v1.0.1.tar.gz')
            .cfg('autoreconf -fiv && ./configure --prefix="' + bin.dest() + '" --bindir="' + bin.dest() + '" --libdir="' + bin.dest() + '"')
            .make('make && make install');

        return builder.build(function (err) {
            if (err) {
                return console.log(chalk.red('✗ ' + err));
            }

            console.log(chalk.green('✓ mozjpeg built successfully'));
        });
    }
});

/**
 * Module exports
 */

module.exports.path = bin.use();
