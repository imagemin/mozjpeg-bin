# mozjpeg [![Build Status](https://secure.travis-ci.org/kevva/mozjpeg.svg?branch=master)](http://travis-ci.org/kevva/mozjpeg)

> mozjpeg is a production-quality JPEG encoder that improves compression while maintaining compatibility with the vast majority of deployed decoders

## Install

```bash
$ npm install --save mozjpeg
```

## Usage

```js
var execFile = require('child_process').execFile;
var mozjpeg = require('mozjpeg').path;

execFile(mozjpeg, ['-v'], function (err, stdout, stderr) {
    console.log('mozjpeg version:', stdout.match(/\d\.\d\.\d/)[0]);
});
```

## CLI

You can also use it as a CLI app by installing it globally:

```bash
$ npm install --global mozjpeg
```

## License

[MIT License](http://en.wikipedia.org/wiki/MIT_License) © [Kevin Mårtensson](http://kevinmartensson.com)
