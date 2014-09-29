from-array
===
[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Coverage Status][coveralls-image]][coveralls-url] [![Dependencies][dependencies-image]][dependencies-url]

> Converts an array to a [readable stream](http://nodejs.org/api/stream.html#stream_class_stream_readable).


## Installation

``` bash
$ npm install flow-from-array
```

For use in the browser, use [browserify](https://github.com/substack/node-browserify).


## Usage

To use the module,

``` javascript
var fromArray = require( 'flow-from-array' );
```

#### fromArray( arr[, options] )

Returns a readable `stream` where each emitted datum is an element from the input `array`.

To convert an `array` to a readable stream,

``` javascript
var stream = fromArray( [1,2,3,4] );
```

To set the readable stream `options`,

``` javascript
var opts = {
		'objectMode': true,
		'encoding': 'utf8',
		'highWaterMark': 8
	};

stream = fromArray( ['b','e','e','p'], opts );
```


#### fromArray.factory( [options] )

Returns a reusable stream factory. The factory method ensures streams are configured identically by using the same set of provided `options`.

``` javascript
var opts = {
		'objectMode': true,
		'encoding': 'utf8',
		'highWaterMark': 8
	};

var factory = fromArray.factory( opts );

var streams = new Array( 10 ),
	data;

// Create many streams configured identically but reading different datasets...
for ( var i = 0; i < streams.length; i++ ) {
	data = new Array( 100 );
	for ( var j = 0; j < data.length; j++ ) {
		data[ j ] = Math.random();
	}
	streams[ i ] = factory( data );
}
```


#### fromArray.objectMode( arr[, options] )

This method is a convenience function to create readable streams which always operate in `objectMode`. The method will __always__ override the `objectMode` option in `options`.

``` javascript
var fromArray = require( 'flow-from-array' ).objectMode;

fromArray( ['b','e','e','p'] )
	.pipe( process.stdout );
```


## Examples

``` javascript
var append = require( 'flow-append' ).objectMode,
	fromArray = require( 'flow-from-array' );

// Create some data...
var data = new Array( 1000 );
for ( var i = 0; i < data.length; i++ ) {
	data[ i ] = Math.random();
}

// Create a readable stream:
var readableStream = fromArray( data );

// Pipe the data:
readableStream
	.pipe( append( '\n' ) )
	.pipe( process.stdout );
```

To run the example code from the top-level application directory,

``` bash
$ node ./examples/index.js
```


## Notes

This stream is a Streams2 version of [event-stream](https://github.com/dominictarr/event-stream) and its `readArray()` method.

When in `objectMode`, an `array` cannot contain `null` or `undefined` values. An `array` containing either of these values will emit an `error` and close.

When not in `objectMode`, all `array` values are buffered. This means that anything which is not a `buffer` or a `string` is coerced into being a `string`. Values are stringified according to the following conventions:

*	`undefined`: `"undefined"`
*	`null`: `"null"`
*	`number`: `<number>.toString()`
*	`boolean`: `<boolean>.toString()`
*	`function`: `<function>.toString()`
*	`array`: `JSON.stringify( <array> )`
*	`object`: `JSON.stringify( <object> )`

With the exception of `arrays` and `objects`, the conventions follow the [ES5 specification](http://es5.github.io/#x9.8). `arrays` and `objects` are more conveniently stringified.

Note that the stringified values are buffered according to the `encoding` option. If the `encoding` is `null` (default), buffering assumes `utf8` encoding. 


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


[npm-image]: http://img.shields.io/npm/v/flow-from-array.svg
[npm-url]: https://npmjs.org/package/flow-from-array

[travis-image]: http://img.shields.io/travis/flow-io/from-array-node/master.svg
[travis-url]: https://travis-ci.org/flow-io/from-array-node

[coveralls-image]: https://img.shields.io/coveralls/flow-io/from-array-node/master.svg
[coveralls-url]: https://coveralls.io/r/flow-io/from-array-node?branch=master

[dependencies-image]: http://img.shields.io/david/flow-io/from-array-node.svg
[dependencies-url]: https://david-dm.org/flow-io/from-array-node

[dev-dependencies-image]: http://img.shields.io/david/dev/flow-io/from-array-node.svg
[dev-dependencies-url]: https://david-dm.org/dev/flow-io/from-array-node

[github-issues-image]: http://img.shields.io/github/issues/flow-io/from-array-node.svg
[github-issues-url]: https://github.com/flow-io/from-array-node/issues