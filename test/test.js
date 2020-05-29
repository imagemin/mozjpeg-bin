'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');
const test = require('ava');
const execa = require('execa');
const tempy = require('tempy');
const binCheck = require('bin-check');
const binBuild = require('bin-build');
const compareSize = require('compare-size');
const mozjpeg = require('..');

const cpuNum = os.cpus().length;

test('rebuild the mozjpeg binaries', async t => {
	const tmp = tempy.directory();
	const cfg = [
		'./configure --enable-static --disable-shared --disable-dependency-tracking --with-jpeg8',
		`--prefix="${tmp}" --bindir="${tmp}" --libdir="${tmp}"`
	].join(' ');

	await binBuild.file(path.resolve(__dirname, '../vendor/source/mozjpeg.tar.gz'), [
		'autoreconf -fiv',
		cfg,
		`make --jobs=${cpuNum}`,
		`make install --jobs=${cpuNum}`
	]);

	t.true(fs.existsSync(path.join(tmp, 'cjpeg')));
});

test('return path to binary and verify that it is working', async t => {
	t.true(await binCheck(mozjpeg, ['-version']));
});

test('minify a JPG', async t => {
	const tmp = tempy.directory();
	const src = path.join(__dirname, 'fixtures/test.jpg');
	const dest = path.join(tmp, 'test.jpg');
	const args = [
		'-outfile',
		dest,
		src
	];

	await execa(mozjpeg, args);
	const res = await compareSize(src, dest);

	t.true(res[dest] < res[src]);
});
