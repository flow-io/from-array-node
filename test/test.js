
// MODULES //

var // Expectation library:
	chai = require( 'chai' ),

	// Readable stream class:
	Readable = require( 'stream' ).Readable,

	// Mock reading from a stream:
	mockRead = require( 'flow-mock-read' ),

	// Module to be tested:
	stream = require( './../lib' );


// VARIABLES //

var expect = chai.expect,
	assert = chai.assert;


// TESTS //

describe( 'flow-read-array', function tests() {
	'use strict';

	it( 'should export a function', function test() {
		expect( stream ).to.be.a( 'function' );
	});

	it( 'should throw an error if not provided an array', function test() {
		var values = [
				5,
				'5',
				true,
				NaN,
				null,
				undefined,
				{},
				function(){}
			];

		for ( var i = 0; i < values.length; i++ ) {
			expect( badValue( values[i] ) ).to.throw( TypeError );
		}

		function badValue( value ) {
			return function() {
				stream( value );
			};
		}
	});

	it( 'should throw an error if provided options is not an object', function test() {
		var values = [
				5,
				'5',
				true,
				NaN,
				null,
				undefined,
				[],
				function(){}
			];

		for ( var i = 0; i < values.length; i++ ) {
			expect( badValue( values[i] ) ).to.throw( TypeError );
		}

		function badValue( value ) {
			return function() {
				stream( [], value );
			};
		}
	});

	it( 'should throw an error if encoding option is not a string or null', function test() {
		var values = [
				5,
				{},
				true,
				NaN,
				undefined,
				[],
				function(){}
			];

		for ( var i = 0; i < values.length; i++ ) {
			expect( badValue( values[i] ) ).to.throw( TypeError );
		}

		function badValue( value ) {
			return function() {
				stream( [], {'encoding': value} );
			};
		}
	});

	it( 'should throw an error if high watermark option is not a number greater than or equal to 0', function test() {
		var values = [
				-5,
				'5',
				{},
				true,
				NaN,
				null,
				undefined,
				[],
				function(){}
			];

		for ( var i = 0; i < values.length; i++ ) {
			expect( badValue( values[i] ) ).to.throw( TypeError );
		}

		function badValue( value ) {
			return function() {
				stream( [], {'highWaterMark': value} );
			};
		}
	});

	it( 'should return a readable stream', function test() {
		var opts = {
				'encoding': null,
				'highWaterMark': 16
			};
		assert.instanceOf( stream( [], opts ), Readable );
	});

	it( 'should convert an array to a readable stream', function test( done ) {
		var expected = [1,2,3,4];

		mockRead( stream( expected ), onData );

		function onData( error, actual ) {
			if ( error ) {
				assert.notOk( true );
				return;
			}
			assert.deepEqual( expected, actual );
			done();
		}
	});

});