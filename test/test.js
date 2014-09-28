
// MODULES //

var // Expectation library:
	chai = require( 'chai' ),

	// Readable stream class:
	Readable = require( 'readable-stream' ).Readable,

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

	describe( 'class', function tests() {

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

		it( 'should throw an error if provided a bad option', function test() {
			expect( foo ).to.throw( TypeError );

			function foo() {
				stream([],{'encoding': []});
			}
		});

		it( 'should return a readable stream', function test() {
			var opts = {
					'objectMode': true,
					'encoding': null,
					'highWaterMark': 16
				};
			assert.instanceOf( stream( [], opts ), Readable );
		});

		it( 'should convert an array of buffer objects to a readable stream', function test( done ) {
			var expected = [ 'beep', 'boop', 'bap' ],
				data = new Array( expected.length );

			for ( var i = 0; i < data.length; i++ ) {
				data[ i ] = new Buffer( expected[i] );
			}
			mockRead( stream( data ), onData );

			function onData( error, actual ) {
				if ( error ) {
					assert.notOk( true );
					return;
				}
				for ( var i = 0; i < actual.length; i++ ) {
					actual[ i ] = actual[ i ].toString();
				}
				assert.deepEqual( expected, actual );
				done();
			}
		});

		it( 'should convert an array to a readable stream in object mode', function test( done ) {
			var expected = ['beep', 'boop', 'bap' ],
				opts = {
					'objectMode': true
				};

			mockRead( stream( expected, opts ), onData );

			function onData( error, actual ) {
				if ( error ) {
					assert.notOk( true );
					return;
				}
				assert.deepEqual( expected, actual );
				done();
			}
		});

		it( 'can be destroyed', function test( done ) {
			var s = stream([]);
			s.on( 'close', function onClose() {
				assert.ok( true );
				done();
			});
			s.destroy();
		});

		it( 'can be destroyed more than once', function test( done ) {
			var s = stream([]);
			s.on( 'close', function onClose() {
				assert.ok( true );
				done();
			});
			s.destroy();
			s.destroy();
		});

		it( 'can be destroyed with an error', function test( done ) {
			var s = stream([]);
			s.on( 'error', function onError( error ) {
				if ( error ) {
					assert.ok( true );
					return;
				}
				assert.notOk( true );
			});
			s.on( 'close', function onClose() {
				assert.ok( true );
				done();
			});
			s.destroy( new Error('beep') );
		});

	});

	describe( 'objectMode', function tests() {

		it( 'should export a function to create streams only operating in objectMode', function test() {
			expect( stream.objectMode ).to.be.a( 'function' );
		});

		it( 'should return a stream in object mode', function test( done ) {
			var Stream = stream,
				readArray = stream.objectMode,
				opts,
				s,
				expected;

			// Returns Stream instance:
			assert.instanceOf( readArray([]), Stream );

			// Sets the objectMode option:
			opts = {
				'objectMode': false
			};
			s = readArray( [], opts );
			assert.strictEqual( opts.objectMode, true );

			// Behaves as expected:
			expected = ['beep', 'boop', 'bap' ];

			mockRead( readArray( expected ), onData );

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

	describe( 'factory', function tests() {

		it( 'should export a reusable stream factory', function test() {
			expect( stream.factory ).to.be.a('function' );
			expect( stream.factory() ).to.be.a( 'function' );
		});

		it( 'should return a stream from the factory', function test() {
			var Stream = stream,
				opts = {'objectMode': true},
				factory = stream.factory( opts );

			assert.instanceOf( factory([]), Stream );
		});

	});

});