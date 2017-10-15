'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');
const test = require('ava');
const execa = require('execa');
const tempy = require('tempy');
const binCheck = require('bin-check');
const BinBuild = require('bin-build');
const compareSize = require('compare-size');
const mozjpeg = require('..');

const cpuNum = (typeof os.cpus() === 'undefined') ? 1 : os.cpus().length;

test.cb('rebuild the mozjpeg binaries', t => {
	const tmp = tempy.directory();
	const cfg = [
		'./configure --disable-shared --disable-dependency-tracking --with-jpeg8',
		`--prefix="${tmp}" --bindir="${tmp}" --libdir="${tmp}"`
	].join(' ');

	new BinBuild()
		.src('https://github.com/mozilla/mozjpeg/releases/download/v3.1/mozjpeg-3.1-release-source.tar.gz')
		.cmd('autoreconf -fiv')
		.cmd(cfg)
		.cmd(`make --jobs=${cpuNum}`)
		.cmd(`make install --jobs=${cpuNum}`)
		.run(err => {
			t.ifError(err);
			t.true(fs.existsSync(path.join(tmp, 'cjpeg')));
			t.end();
		});
});

test('return path to binary and verify that it is working', async t => {
	t.true(await binCheck(mozjpeg, ['-version']));
});

test('minify a JPG', async t => {
	const tmp = tempy.directory();
	const src = path.join(__dirname, 'fixtures/test.jpg');
	const dest = path.join(tmp, 'test.jpg');
	const args = [
		'-outfile', dest,
		src
	];

	await execa(mozjpeg, args);
	const res = await compareSize(src, dest);

	t.true(res[dest] < res[src]);
});
