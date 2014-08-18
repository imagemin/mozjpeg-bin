/*global afterEach, beforeEach, describe, it */
'use strict';

var assert = require('assert');
var binCheck = require('bin-check');
var BinBuild = require('bin-build');
var execFile = require('child_process').execFile;
var fs = require('fs');
var path = require('path');
var rm = require('rimraf');

describe('mozjpeg()', function () {
	afterEach(function (cb) {
		rm(path.join(__dirname, 'tmp'), cb);
	});

	beforeEach(function () {
		fs.mkdirSync(path.join(__dirname, 'tmp'));
	});

	it('should rebuild the mozjpeg binaries', function (cb) {
		var tmp = path.join(__dirname, 'tmp');
		var builder = new BinBuild()
			.src('https://github.com/mozilla/mozjpeg/archive/v2.1.tar.gz')
			.cmd('autoreconf -fiv && ./configure --prefix="' + tmp + '" --bindir="' + tmp + '" --libdir="' + tmp + '"')
			.cmd('make && make install');

		builder.build(function (err) {
			assert(!err);
			assert(fs.existsSync(path.join(tmp, 'jpegtran')));
			cb();
		});
	});

	it('should return path to binary and verify that it is working', function (cb) {
		var binPath = require('../').path;
		var args = [
			'-outfile', path.join(__dirname, 'tmp/test.jpg'),
			path.join(__dirname, 'fixtures/test.jpg')
		];

		binCheck(binPath, args, function (err, works) {
			cb(assert.equal(works, true));
		});
	});

	it('should minify a JPG', function (cb) {
		var binPath = require('../').path;
		var args = [
			'-outfile', path.join(__dirname, 'tmp/test.jpg'),
			path.join(__dirname, 'fixtures', 'test.jpg')
		];

		execFile(binPath, args, function () {
			var src = fs.statSync(path.join(__dirname, 'fixtures/test.jpg')).size;
			var dest = fs.statSync(path.join(__dirname, 'tmp/test.jpg')).size;

			cb(assert(dest < src));
		});
	});
});
