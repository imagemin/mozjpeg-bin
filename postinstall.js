'use strict';

var BinBuild = require('bin-build');
var chalk = require('chalk');
var mozjpeg = require('./index.js');

var builder = new BinBuild()
    .src('https://github.com/mozilla/mozjpeg/archive/v1.0.1.tar.gz')
    .cfg('autoreconf -fiv && ./configure --prefix="' + mozjpeg.dest()
         + '" --bindir="' + mozjpeg.dest() + '" --libdir="' + mozjpeg.dest()
         + '"')
    .make('make install');

console.log("Building mozjpeg...");

return builder.build(function (err) {
    if (err) {
        console.log(chalk.red('✗ ' + err));
        process.exit(1);
    }

    console.log(chalk.green('✓ mozjpeg built successfully'));
    process.exit(0);
});
