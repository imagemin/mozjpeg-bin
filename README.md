# mozjpeg-bin [![Build Status](http://img.shields.io/travis/imagemin/mozjpeg-bin/master.svg?style=flat)](http://travis-ci.org/imagemin/mozjpeg-bin)

> mozjpeg is a production-quality JPEG encoder that improves compression while maintaining compatibility with the vast majority of deployed decoders


## Install

```sh
$ npm install --save mozjpeg
```


## Usage

```js
var execFile = require('child_process').execFile;
var mozjpeg = require('mozjpeg').path;

execFile(mozjpeg, ['-outfile', 'output.jpg', 'input.jpg'], function (err) {
	if (err) {
		throw err;
	}

	console.log('Image minified!');
});
```


## CLI

```sh
$ npm install --global mozjpeg
```

```sh
$ mozjpeg --help
```


## License

MIT © [imagemin](https://github.com/imagemin)
