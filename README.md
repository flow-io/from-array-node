read-array
===
[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Coverage Status][coveralls-image]][coveralls-url] [![Dependencies][dependencies-image]][dependencies-url]

> Converts an array to a readable stream.


## Installation

``` bash
$ npm install flow-read-array
```

For use in the browser, use [browserify](https://github.com/substack/node-browserify).


## Usage




## Examples

``` javascript
var toString = require( 'flow-to-string' ),
	newline = require( 'flow-newline' ),
	readArray = require( 'flow-read-array' ),
	flowStream = require( 'flow-read-array' );

// Create some data...
var data = new Array( 1000 );
for ( var i = 0; i < data.length; i++ ) {
	data[ i ] = Math.random();
}

// Create a readable stream:
var readStream = readArray( data );

// Create a new flow stream:
var stream = flowStream();

// Pipe the data:
readStream
	.pipe( stream )
	.pipe( toString() )
	.pipe( newline() )
	.pipe( process.stdout );
```

To run the example code from the top-level application directory,

``` bash
$ node ./examples/index.js
```


## Tests

### Unit

Unit tests use the [Mocha](http://visionmedia.github.io/mocha) test framework with [Chai](http://chaijs.com) assertions. To run the tests, execute the following command in the top-level application directory:

``` bash
$ make test
```

All new feature development should have corresponding unit tests to validate correct functionality.


### Test Coverage

This repository uses [Istanbul](https://github.com/gotwarlost/istanbul) as its code coverage tool. To generate a test coverage report, execute the following command in the top-level application directory:

``` bash
$ make test-cov
```

Istanbul creates a `./reports/coverage` directory. To access an HTML version of the report,

``` bash
$ open reports/coverage/lcov-report/index.html
```


## License

[MIT license](http://opensource.org/licenses/MIT). 


---
## Copyright

Copyright &copy; 2014. Athan Reines.


[npm-image]: http://img.shields.io/npm/v/flow-read-array.svg
[npm-url]: https://npmjs.org/package/flow-read-array

[travis-image]: http://img.shields.io/travis/flow-io/read-array-node/master.svg
[travis-url]: https://travis-ci.org/flow-io/read-array-node

[coveralls-image]: https://img.shields.io/coveralls/flow-io/read-array-node/master.svg
[coveralls-url]: https://coveralls.io/r/flow-io/read-array-node?branch=master

[dependencies-image]: http://img.shields.io/david/flow-io/read-array-node.svg
[dependencies-url]: https://david-dm.org/flow-io/read-array-node

[dev-dependencies-image]: http://img.shields.io/david/dev/flow-io/read-array-node.svg
[dev-dependencies-url]: https://david-dm.org/dev/flow-io/read-array-node

[github-issues-image]: http://img.shields.io/github/issues/flow-io/read-array-node.svg
[github-issues-url]: https://github.com/flow-io/read-array-node/issues