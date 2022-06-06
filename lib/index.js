import fs from 'node:fs';
import process from 'node:process';
import {fileURLToPath} from 'node:url';
import BinWrapper from 'bin-wrapper';

const pkg = JSON.parse(fs.readFileSync(new URL('../package.json', import.meta.url)));
const url = `https://raw.githubusercontent.com/imagemin/mozjpeg-bin/v${pkg.version}/vendor/`;

const binWrapper = new BinWrapper()
        .src(`${url}macos/cjpeg`, 'darwin')
        .src(`${url}linux/x64/cjpeg`, 'linux', 'x64')
        .src(`${url}linux/arm64/cjpeg`, 'linux', 'arm64')
        .src(`${url}win/cjpeg.exe`, 'win32')
        .dest(fileURLToPath(new URL('../vendor', import.meta.url)))
        .use(process.platform === 'win32' ? 'cjpeg.exe' : 'cjpeg');

export default binWrapper;
