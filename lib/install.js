import process from 'node:process';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import fs from 'node:fs';
import {execa, $} from 'execa';
import binBuild from 'bin-build';
import bin from './index.js';

bin.run(['-version']).then(() => {
	console.log('mozjpeg pre-build test passed successfully');
}).catch(async error => {
	console.warn(error.message);
	console.warn('mozjpeg pre-build test failed');
	console.info('compiling from source');

	const config = [];
	const vcpkgInstall = [];

	if (process.platform === 'darwin') {
		config.push('-DCMAKE_FIND_FRAMEWORK=LAST -DBUILD_SHARED_LIBS=OFF');
	}

	if (process.platform === 'win32') {
		const directoryPath = '.\\vcpkg';
		if (fs.existsSync(directoryPath)) {
			console.log('vcpkg already downloaded');
		} else {
			await $`git clone https://github.com/microsoft/vcpkg.git`;
		}

		// Build vcpkg
		await execa('.\\vcpkg\\bootstrap-vcpkg.bat');

		// Install libpng and zlib
		if (process.arch === 'x64') {
			vcpkgInstall.push('--triplet x64-windows libpng:x64-windows-static zlib:x64-windows-static');
		} else if (process.arch === 'arm64') {
			vcpkgInstall.push('--triplet arm64-windows libpng:arm64-windows-static zlib:arm64-windows-static');
		}

		const vcpkg = [`.\\vcpkg\\vcpkg install ${vcpkgInstall.join(' ')} libpng zlib`];

		await execa(`${vcpkg}`);

		const currentPath = path.resolve('.', './vcpkg/scripts/buildsystems/vcpkg.cmake');
		// Add vcpkg toolchain file to the configuration
		config.push(`-DCMAKE_TOOLCHAIN_FILE=${currentPath}`);
	}

	const cfg = [
		`cmake -DCMAKE_BUILD_TYPE=Release ${config.join(' ')} .`,
	].join(' ');

	try {
		const source = fileURLToPath(new URL('../vendor/source/mozjpeg.tar.gz', import.meta.url));
		if (process.platform === 'win32') {
			await binBuild.file(source, [
				cfg,
				'cmake --build . --config Release',
				`copy Release\\cjpeg.exe ${bin.dest()}\\cjpeg.exe`,
				`copy Release\\turbojpeg.dll ${bin.dest()}\\turbojpeg.dll`,
				`copy Release\\libpng16.dll ${bin.dest()}\\libpng16.dll`,
				`copy Release\\jpeg62.dll ${bin.dest()}\\jpeg62.dll`,
				`copy Release\\zlib1.dll ${bin.dest()}\\zlib1.dll`,
			]);
		} else {
			await binBuild.file(source, [
				cfg,
				'cmake --build . ',
				`cp cjpeg-static ${bin.dest()}/cjpeg`,
			]);
		}

		console.log('mozjpeg built successfully');
	} catch (error) {
		console.error(error.stack);

		// eslint-disable-next-line unicorn/no-process-exit
		process.exit(1);
	}
});
