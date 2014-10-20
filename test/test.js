'use strict';

var binCheck = require('bin-check');
var BinBuild = require('bin-build');
var compareSize = require('compare-size');
var execFile = require('child_process').execFile;
var fs = require('fs');
var path = require('path');
var test = require('ava');
var tmp = path.join(__dirname, 'tmp');

test('rebuild the mozjpeg binaries', function (t) {
	t.plan(2);

	var version = require('../').version;
	var cfg = [
		'./configure --disable-shared',
		'--prefix="' + tmp + '" --bindir="' + tmp + '"',
		'--libdir="' + tmp + '"'
	].join(' ');

	var builder = new BinBuild()
		.src('https://github.com/mozilla/mozjpeg/archive/v' + version + '.tar.gz')
		.cmd('autoreconf -fiv')
		.cmd(cfg)
		.cmd('make && make install');

	builder.run(function (err) {
		t.assert(!err, err);

		fs.exists(path.join(tmp, 'jpegtran'), function (exists) {
			t.assert(exists);
		});
	});
});

test('return path to binary and verify that it is working', function (t) {
	t.plan(2);

	var args = [
		'-outfile', path.join(tmp, 'test.jpg'),
		path.join(__dirname, 'fixtures/test.jpg')
	];

	binCheck(require('../').path, args, function (err, works) {
		t.assert(!err, err);
		t.assert(works);
	});
});

test('minify a JPG', function (t) {
	t.plan(3);

	var src = path.join(__dirname, 'fixtures/test.jpg');
	var dest = path.join(tmp, 'test.jpg');
	var args = [
		'-outfile', dest,
		src
	];

	execFile(require('../').path, args, function (err) {
		t.assert(!err, err);

		compareSize(src, dest, function (err, res) {
			t.assert(!err, err);
			t.assert(res[dest] < res[src]);
		});
	});
});
