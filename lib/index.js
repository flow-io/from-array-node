/**
*
*	STREAM: read-array
*
*
*	DESCRIPTION:
*		- Converts an array to a readable stream.
*
*
*	NOTES:
*		[1] 
*
*
*	TODO:
*		[1] 
*
*
*	LICENSE:
*		MIT
*
*	Copyright (c) 2014. Athan Reines.
*
*
*	AUTHOR:
*		Athan Reines. kgryte@gmail.com. 2014.
*
*/

(function() {
	'use strict';

	// MODULES //

	var Readable = require( 'stream' ).Readable,
		isObject = require( 'validate.io-object' );


	// STREAM //

	/**
	* FUNCTION: Stream( arr[, options] )
	*	Readable stream constructor.
	*
	* @constructor
	* @param {Array} arr - array to convert into a readable stream
	* @param {Object} [options] - Readable stream options
	* @returns {Stream} readable stream
	*/
	function Stream( arr, options ) {
		var encoding, hwMark;
		if ( !Array.isArray( arr ) ) {
			throw new TypeError( 'Stream()::invalid input argument. First argument must provide an array.' );
		}
		if ( arguments.length > 1 ) {
			if ( !isObject( options ) ) {
				throw new TypeError( 'Stream()::invalid input argument. Options must be an object.' );
			}
		} else {
			options = {};
		}
		if ( !( this instanceof Stream ) ) {
			return new Stream( arr, options );
		}
		if ( options.hasOwnProperty( 'encoding' ) ) {
			encoding = options.encoding;
			if ( typeof encoding !== 'string' && encoding !== null ) {
				throw new TypeError( 'Stream()::invalid input argument. Encoding must be a string or null.' );
			}
		}
		if ( options.hasOwnProperty( 'highWaterMark' ) ) {
			hwMark = options.highWaterMark;
			if ( typeof hwMark !== 'number' || hwMark !== hwMark || hwMark < 0 ) {
				throw new TypeError( 'Stream()::invalid input argument. High watermark must be numeric and greater than 0.' );
			}
		}
		options.objectMode = true;
		Readable.call( this, options );
		this._array = arr.slice();
		return this;
	} // end FUNCTION Stream()

	/**
	* Create a prototype which inherits from the parent prototype.
	*/
	Stream.prototype = Object.create( Readable.prototype );

	/**
	* Set the constructor.
	*/
	Stream.prototype.constructor = Stream;

	/**
	* METHOD: _read()
	*	Implements the `_read` method to fetch data from the source array.
	*
	* @private
	*/
	Stream.prototype._read = function() {
		var arr = this._array;
		if ( arr.length ) {
			this.push( arr.shift() );
			return;
		}
		this.push( null );
	}; // end METHOD _read()


	// EXPORTS //

	module.exports = Stream;

})();