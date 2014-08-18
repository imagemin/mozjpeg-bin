'use strict';

var bin = require('./');
var BinBuild = require('bin-build');
var logSymbols = require('log-symbols');
var path = require('path');

/**
 * Install binary and check whether it works.
 * If the test fails, try to build it.
 */

var args = [
	'-copy', 'none',
	'-outfile', path.join(__dirname, '../test/fixtures/test-optimized.jpg'),
	path.join(__dirname, '../test/fixtures/test.jpg')
];

bin.run(args, function (err) {
	if (err) {
		console.log(logSymbols.warning + ' pre-build test failed, compiling from source...');

		var builder = new BinBuild()
			.src('https://github.com/mozilla/mozjpeg/archive/v' + bin.v + '.tar.gz')
			.cmd('autoreconf -fiv && ./configure --disable-shared --prefix="' + bin.dest() + '" --bindir="' + bin.dest() + '" --libdir="' + bin.dest() + '"')
			.cmd('make && make install');

		return builder.build(function (err) {
			if (err) {
				console.log(logSymbols.error, err);
				return;
			}

			console.log(logSymbols.success + ' mozjpeg built successfully!');
		});
	}

	console.log(logSymbols.success + ' pre-build test passed successfully!');
});
