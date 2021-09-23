# mozjpeg-bin ![GitHub Actions Status](https://github.com/imagemin/mozjpeg-bin/workflows/test/badge.svg?branch=master)

> [mozjpeg](https://github.com/mozilla/mozjpeg) is a production-quality JPEG encoder that improves compression while maintaining compatibility with the vast majority of deployed decoders

You probably want [`imagemin-mozjpeg`](https://github.com/imagemin/imagemin-mozjpeg) instead.


## Install

```
$ npm install mozjpeg
```

This package attempts to download a prebuilt binary on post install.
This attempts to reach out to `raw.githubusercontent.com`. If you would rather pull this from an
internal proxy, you can set `GITHUB_RAW_URL` on your environment to overwrite the url to your 
internal proxy.


## Usage

```js
const {execFile} = require('child_process');
const mozjpeg = require('mozjpeg');

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
