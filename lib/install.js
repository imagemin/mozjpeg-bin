'use strict';

var bin = require('./');
var BinBuild = require('bin-build');
var log = require('logalot');
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
		log.warn(err.message);
		log.warn('mozjpeg pre-build test failed');
		log.info('compiling from source');

		var cfg = [
			'./configure --disable-shared',
			'--prefix="' + bin.dest() + '" --bindir="' + bin.dest() + '"',
			'--libdir="' + bin.dest() + '"'
		].join(' ');

		var builder = new BinBuild()
			.src('https://github.com/mozilla/mozjpeg/archive/v' + bin.v + '.tar.gz')
			.cmd('autoreconf -fiv')
			.cmd(cfg)
			.cmd('make && make install');

		return builder.run(function (err) {
			if (err) {
				if (err.message.indexOf('Command failed: autoreconf') !== -1) {
					err.message = [
						'mozjpeg failed to build, make sure that',
						'autoconf is installed'
					].join(' ');
				}

				log.error(err.stack);
				return;
			}

			log.success('mozjpeg built successfully');
		});
	}

	log.success('mozjpeg pre-build test passed successfully');
});
