var toString = require( 'flow-to-string' ),
	append = require( 'flow-append' ).objectMode,
	readArray = require( 'flow-read-array' );

// Create some data...
var data = new Array( 1000 );
for ( var i = 0; i < data.length; i++ ) {
	data[ i ] = Math.random();
}

// Create a readable stream:
var readStream = readArray( data );

// Pipe the data:
readStream
	.pipe( toString() )
	.pipe( append( '\n' ) )
	.pipe( process.stdout );