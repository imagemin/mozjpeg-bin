import fs from 'node:fs';
import process from 'node:process';
import {fileURLToPath} from 'node:url';
import BinWrapper from 'bin-wrapper';

const pkg = JSON.parse(fs.readFileSync(new URL('../package.json', import.meta.url)));
const url = `https://github.com/imagemin/mozjpeg-bin/raw/${pkg.version}/vendor/`;

const binWrapper = new BinWrapper()
	.src(`${url}macos/amd64/cjpeg`, 'darwin', 'x64')
	.src(`${url}macos/arm64/cjpeg`, 'darwin', 'arm64')
	.src(`${url}linux/amd64/cjpeg`, 'linux', 'x64')
	.src(`${url}linux/arm64/cjpeg`, 'linux', 'arm64')
	.src(`${url}win/x86/cjpeg.exe`, 'win32', 'x86')
	.src(`${url}win/x64/cjpeg.exe`, 'win32', 'x64')
	.dest(fileURLToPath(new URL('../vendor', import.meta.url)))
	.use(process.platform === 'win32' ? 'cjpeg.exe' : 'cjpeg');

export default binWrapper;
