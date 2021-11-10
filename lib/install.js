import process from 'node:process';
import {fileURLToPath} from 'node:url';
import binBuild from 'bin-build';
import bin from './index.js';

bin.run(['-version']).then(() => {
	console.log('mozjpeg pre-build test passed successfully');
}).catch(async error => {
	console.warn(error.message);
	console.warn('mozjpeg pre-build test failed');
	console.info('compiling from source');

	try {
		const config = [];
		const source = fileURLToPath(new URL('../vendor/source/mozjpeg.tar.gz', import.meta.url));

		if (process.platform === 'darwin') {
			config.push('-DCMAKE_PREFIX_PATH=$(brew --prefix libpng)');
		}

		await binBuild.file(source, [
			`cmake -G"Unix Makefiles" ${config.join(' ')} .`,
			'make',
			`mv ./cjpeg ${bin.dest()}`,
		]);

		console.log('mozjpeg built successfully');
	} catch (error) {
		console.error(error.stack);

		// eslint-disable-next-line unicorn/no-process-exit
		process.exit(1);
	}
});
