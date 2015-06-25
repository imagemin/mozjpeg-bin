/*global afterEach,beforeEach,it*/
'use strict';

var assert = require('assert');
var execFile = require('child_process').execFile;
var fs = require('fs');
var path = require('path');
var binCheck = require('bin-check');
var BinBuild = require('bin-build');
var compareSize = require('compare-size');
var mkdirp = require('mkdirp');
var rimraf = require('rimraf');
var tmp = path.join(__dirname, 'tmp');

beforeEach(function () {
	mkdirp.sync(tmp);
});

afterEach(function () {
	rimraf.sync(tmp);
});

it('rebuild the mozjpeg binaries', function (cb) {
	var cfg = [
		'./configure --disable-shared',
		'--prefix="' + tmp + '" --bindir="' + tmp + '"',
		'--libdir="' + tmp + '"'
	].join(' ');

	new BinBuild()
		.src('https://github.com/mozilla/mozjpeg/archive/v3.1.tar.gz')
		.cmd('autoreconf -fiv')
		.cmd(cfg)
		.cmd('make && make install')
		.run(function (err) {
			assert(!err);
			assert(fs.statSync(path.join(tmp, 'cjpeg')).isFile());
			cb();
		});
});

it('return path to binary and verify that it is working', function (cb) {
	var args = [
		'-outfile', path.join(tmp, 'test.jpg'),
		path.join(__dirname, 'fixtures/test.jpg')
	];

	binCheck(require('../'), args, function (err, works) {
		assert(!err);
		assert(works);
		cb();
	});
});

it('minify a JPG', function (cb) {
	var src = path.join(__dirname, 'fixtures/test.jpg');
	var dest = path.join(tmp, 'test.jpg');
	var args = [
		'-outfile', dest,
		src
	];

	execFile(require('../'), args, function (err) {
		assert(!err);

		compareSize(src, dest, function (err, res) {
			assert(!err);
			assert(res[dest] < res[src]);
			cb();
		});
	});
});
