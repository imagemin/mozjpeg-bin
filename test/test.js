/*global afterEach, beforeEach, describe, it */
'use strict';

var assert = require('assert');
var binCheck = require('bin-check');
var BinWrapper = require('bin-wrapper');
var fs = require('fs');
var path = require('path');
var spawn = require('child_process').spawn;
var rm = require('rimraf');

describe('optipng()', function () {
    afterEach(function (cb) {
        rm(path.join(__dirname, 'tmp'), cb);
    });

    beforeEach(function (cb) {
        fs.mkdir(path.join(__dirname, 'tmp'), cb);
    });

    it('should rebuild the mozjpeg binaries', function (cb) {
        var bin = new BinWrapper({ bin: 'jpegtran', dest: path.join(__dirname, 'tmp') });
        var bs = 'autoreconf -fiv && ./configure --prefix="' + bin.dest +
                 '" --bindir="' + bin.dest + '" --libdir="' + bin.dest + '" && make && make install';

        bin
            .addSource('https://github.com/mozilla/mozjpeg/archive/v1.0.1.tar.gz')
            .build(bs)
            .on('finish', function () {
                cb(assert(true));
            });
    });

    it('should return path to binary and verify that it is working', function (cb) {
        var binPath = require('../').path;

        binCheck(binPath, '--version', function (err, works) {
            cb(assert.equal(works, true));
        });
    });

    it('should minify a JPEG', function (cb) {
        var binPath = require('../').path;
        var args = [
            '-optimize',
            '-outfile', path.join(__dirname, 'tmp/test.jpg'),
            path.join(__dirname, 'fixtures', 'test.jpg')
        ];

        spawn(binPath, args).on('close', function () {
            var src = fs.statSync(path.join(__dirname, 'fixtures/test.jpg')).size;
            var dest = fs.statSync(path.join(__dirname, 'tmp/test.jpg')).size;

            assert(dest < src);
            assert(dest > 0);
            cb();
        });
    });
});
