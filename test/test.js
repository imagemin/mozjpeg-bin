/* eslint-env mocha */
'use strict';
var assert = require('assert');
var execFile = require('child_process').execFile;
var fs = require('fs');
var os = require('os');
var path = require('path');
var binCheck = require('bin-check');
var BinBuild = require('bin-build');
var compareSize = require('compare-size');
var mkdirp = require('mkdirp');
var rimraf = require('rimraf');
var tmp = path.join(__dirname, 'tmp');
var cpuNum = os.cpus().length;

beforeEach(function (cb) {
	mkdirp(tmp, cb);
});

afterEach(function (cb) {
	rimraf(tmp, {disableGlob: true}, cb);
});

it('rebuild the mozjpeg binaries', function (cb) {
	this.timeout(150000);

	var cfg = [
		'./configure --disable-shared --disable-dependency-tracking --with-jpeg8',
		'--prefix="' + tmp + '" --bindir="' + tmp + '"',
		'--libdir="' + tmp + '"'
	].join(' ');

	new BinBuild()
		.src('https://github.com/mozilla/mozjpeg/releases/download/v3.1/mozjpeg-3.1-release-source.tar.gz')
		.cmd('autoreconf -fiv')
		.cmd(cfg)
		.cmd('make --jobs=' + String(cpuNum))
		.cmd('make install --jobs=' + String(cpuNum))
		.run(function (err) {
			if (err) {
				cb(err);
				return;
			}

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
		if (err) {
			cb(err);
			return;
		}

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
		if (err) {
			cb(err);
			return;
		}

		compareSize(src, dest, function (err, res) {
			if (err) {
				cb(err);
				return;
			}

			assert(res[dest] < res[src]);
			cb();
		});
	});
});
