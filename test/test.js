import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import {fileURLToPath} from 'node:url';
import test from 'ava';
import execa from 'execa';
import tempy from 'tempy';
import binCheck from 'bin-check';
import binBuild from 'bin-build';
import compareSize from 'compare-size';
import mozjpeg from '../index.js';

test('rebuild the mozjpeg binaries', async t => {
	// Skip the test on Windows
	if (process.platform === 'win32') {
		t.pass();
		return;
	}

	const temporary = tempy.directory();
	const config = [];
	const source = fileURLToPath(new URL('../vendor/source/mozjpeg.tar.gz', import.meta.url));

	if (process.platform === 'darwin') {
		config.push('-DCMAKE_PREFIX_PATH=$(brew --prefix libpng)');
	}

	await binBuild.file(source, [
		`cmake -G"Unix Makefiles" ${config.join(' ')} .`,
		'make',
		`mv ./cjpeg ${temporary}`,
	]);

	t.true(fs.existsSync(path.join(temporary, 'cjpeg')));
});

test('return path to binary and verify that it is working', async t => {
	t.true(await binCheck(mozjpeg, ['-version']));
});

test('minify a JPG', async t => {
	const temporary = tempy.directory();
	const src = fileURLToPath(new URL('./fixtures/test.jpg', import.meta.url));
	const dest = path.join(temporary, 'test.jpg');
	const args = [
		'-outfile',
		dest,
		src,
	];

	await execa(mozjpeg, args);
	const result = await compareSize(src, dest);

	t.true(result[dest] < result[src]);
});
