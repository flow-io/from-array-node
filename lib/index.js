/**
*
*	STREAM: from-array
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

	var Readable = require( 'readable-stream' ).Readable,
		validate = require( './validate.js' );


	// FUNCTIONS //

	/**
	* FUNCTION: copyOptions( options )
	*	Copies relevant stream options into a new object.
	*
	* @private
	* @param {Object} options - stream options
	* @returns {Object} options copy
	*/
	function copyOptions( options ) {
		var props = [
				'objectMode',
				'highWaterMark',
				'encoding'
			],
			copy = {},
			prop;

		for ( var i = 0; i < props.length; i++ ) {
			prop = props[ i ];
			if ( options.hasOwnProperty( prop ) ) {
				copy[ prop ] = options[ prop ];
			}
		}
		return copy;
	} // end FUNCTION copyOptions()


	// STREAM //

	/**
	* FUNCTION: Stream( arr[, options] )
	*	Readable stream constructor.
	*
	* @constructor
	* @param {Array} arr - array to convert into a readable stream
	* @param {Object} [options] - Readable stream options
	* @returns {Stream} Readable stream
	*/
	function Stream( arr, options ) {
		if ( !Array.isArray( arr ) ) {
			throw new TypeError( 'Stream()::invalid input argument. First argument must be an array.' );
		}
		if ( arguments.length < 2 ) {
			options = {};
		}
		if ( !( this instanceof Stream ) ) {
			return new Stream( arr, options );
		}
		var err = validate( options );
		if ( err ) {
			throw err;
		}
		Readable.call( this, options );
		this._array = arr.slice();
		this._destroyed = false;
		this._enc = options.encoding;
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
			this.push( arr.shift(), this._enc );
			return;
		}
		this.push( null );
	}; // end METHOD _read()

	/**
	* METHOD: destroy( [error] )
	*	Gracefully destroys a stream, providing backwards compatibility.
	*
	* @param {Object} [error] - optional error message
	* @returns {Stream} Stream instance
	*/
	Stream.prototype.destroy = function( error ) {
		if ( this._destroyed ) {
			return;
		}
		var self = this;
		this._destroyed = true;
		process.nextTick( function destroy() {
			if ( error ) {
				self.emit( 'error', error );
			}
			self.emit( 'close' );
		});
		return this;
	}; // end METHOD destroy()


	// OBJECT MODE //

	/**
	* FUNCTION: objectMode( arr[, options] )
	*	Returns a stream with `objectMode` set to `true`.
	*
	* @param {Array} arr - array to convert into a readable stream
	* @param {Object} [options] - Readable stream options
	* @returns {Stream} Readable stream
	*/
	function objectMode( arr, options ) {
		if ( arguments.length < 2 ) {
			options = {};
		}
		options.objectMode = true;
		return new Stream( arr, options );
	} // end FUNCTION objectMode()


	// FACTORY //

	/**
	* FUNCTION: streamFactory( [options] )
	*	Creates a reusable stream factory.
	*
	* @param {Object} [options] - Readable stream options
	* @returns {Function} stream factory
	*/
	function streamFactory( options ) {
		if ( !arguments.length ) {
			options = {};
		}
		options = copyOptions( options );
		/**
		* FUNCTION: createStream( arr )
		*	Creates a stream.
		*
		* @param {Array} arr - array to convert into a readable stream
		* @returns {Stream} Readable stream
		*/
		return function createStream( arr ) {
			return new Stream( arr, options );
		};
	} // end METHOD streamFactory()


	// EXPORTS //

	module.exports = Stream;
	module.exports.objectMode = objectMode;
	module.exports.factory = streamFactory;

})();