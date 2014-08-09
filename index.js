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
        var args = [
            '-copy', 'none',
            '-outfile', path.join(__dirname, 'test/fixtures/test-optimized.jpg'),
            path.join(__dirname, 'test/fixtures/test.jpg')
        ];

        bin.run(args, function (err) {
                if (err) {
                    console.log(logSymbols.warning + ' pre-build test failed, compiling from source...');

                    var builder = new BinBuild()
                        .src('https://github.com/mozilla/mozjpeg/archive/v' + BIN_VERSION + '.tar.gz')
                        .cmd('autoreconf -fiv && ./configure --disable-shared --prefix="' + bin.dest() + '" --bindir="' + bin.dest() + '" --libdir="' + bin.dest() + '"')
                        .cmd('make && make install');

                    return builder.build(function (err) {
                        if (err) {
                            return console.log(logSymbols.error, err);
                        }

                        console.log(logSymbols.success + ' mozjpeg built successfully!');
                    });
                }

                console.log(logSymbols.success + ' pre-build test passed successfully!');
            });
    }
});

/**
 * Module exports
 */

module.exports.path = bin.use();
