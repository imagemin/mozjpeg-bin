'use strict';

var binCheck = require('bin-check');
var BinBuild = require('bin-build');
var execFile = require('child_process').execFile;
var fs = require('fs');
var mkdir = require('mkdirp');
var path = require('path');
var rm = require('rimraf');
var test = require('ava');
var tmp = path.join(__dirname, 'tmp');

test('rebuild the mozjpeg binaries', function (t) {
	t.plan(3);

	var builder = new BinBuild()
		.src('https://github.com/mozilla/mozjpeg/archive/v2.1.tar.gz')
		.cmd('autoreconf -fiv && ./configure --prefix="' + tmp + '" --bindir="' + tmp + '" --libdir="' + tmp + '"')
		.cmd('make && make install');

	builder.build(function (err) {
		t.assert(!err);

		fs.exists(path.join(tmp, 'jpegtran'), function (exists) {
			t.assert(exists);

			rm(tmp, function (err) {
				t.assert(!err);
			});
		});
	});
});

test('return path to binary and verify that it is working', function (t) {
	t.plan(3);

	var args = [
		'-outfile', path.join(tmp, 'test.jpg'),
		path.join(__dirname, 'fixtures/test.jpg')
	];

	mkdir(tmp, function (err) {
		t.assert(!err);

		binCheck(require('../').path, args, function (err, works) {
			t.assert(!err);
			t.assert(works);

		});
	});
});

test('minify a JPG', function (t) {
	t.plan(6);

	var args = [
		'-outfile', path.join(tmp, 'test.jpg'),
		path.join(__dirname, 'fixtures/test.jpg')
	];

	mkdir(tmp, function (err) {
		t.assert(!err);

		execFile(require('../').path, args, function (err) {
			t.assert(!err);

			fs.stat(path.join(__dirname, 'fixtures/test.jpg'), function (err, a) {
				t.assert(!err);

				fs.stat(path.join(tmp, 'test.jpg'), function (err, b) {
					t.assert(!err);
					t.assert(b.size < a.size);

					rm(tmp, function (err) {
						t.assert(!err);
					});
				});
			});
		});
	});
});
