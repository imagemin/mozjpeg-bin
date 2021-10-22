# mozjpeg-bin ![GitHub Actions Status](https://github.com/imagemin/mozjpeg-bin/workflows/test/badge.svg?branch=main)

> [mozjpeg](https://github.com/mozilla/mozjpeg) is a production-quality JPEG encoder that improves compression while maintaining compatibility with the vast majority of deployed decoders

You probably want [`imagemin-mozjpeg`](https://github.com/imagemin/imagemin-mozjpeg) instead.


## Install

```
$ npm install mozjpeg
```


## Usage

```js
import {execFile} from 'node:child_process';
import mozjpeg from 'mozjpeg';

execFile(mozjpeg, ['-outfile', 'output.jpg', 'input.jpg'], err => {
	console.log('Image minified!');
});
```


## CLI

```
$ npm install --global mozjpeg
```

```
$ mozjpeg --help
```


## License

MIT © [Imagemin](https://github.com/imagemin)
