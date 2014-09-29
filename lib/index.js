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

	/**
	* FUNCTION: setOptions( options )
	*	Sets stream specific options.
	*
	* @private
	* @param {Object} options - stream options
	*/
	function setOptions( options ) {
		if ( !options.hasOwnProperty( 'objectMode' ) ) {
			options.objectMode = false;
		}
		if ( !options.hasOwnProperty( 'encoding' ) ) {
			options.encoding = null;
		}
	} // end FUNCTION setOptions()


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
		setOptions( options );
		Readable.call( this, options );
		this._array = arr.slice();
		this._destroyed = false;
		this._enc = options.encoding;
		this._mode = options.objectMode;
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
		var arr = this._array,
			isBuffer = false,
			val,
			type;

		if ( arr.length ) {
			val = arr.shift();
			type = typeof val;

			// Object mode...
			if ( this._mode ) {
				if ( type === 'undefined' || val === null ) {
					this.destroy( new Error( 'cannot stream `undefined` or `null` values in objectMode.' ) );
					return;
				}
				this.push( val );
				return;
			}

			// Binary mode...
			
			// Note: cannot simply use String( val ), as this fails for arrays and objects, which are better stringified. For more information, see http://es5.github.io/#x9.8.

			// Note: in the following, order DOES matter. We exit early if the value is a `buffer` or a `string`. `array` and `null` need to be before `object`.

			if ( Buffer.isBuffer( val ) ) {
				isBuffer = true;
			}
			else if ( type === 'string' ) {
				// No-op.
			}
			else if ( type === 'undefined' ) {
				val = 'undefined';
			}
			else if ( type === 'boolean' ) {
				val = val.toString();
			}
			else if ( type === 'number' ) {
				val = val.toString();
			}
			else if ( type === 'function' ) {
				val = val.toString();
			}
			else if ( Array.isArray( val ) ) {
				val = JSON.stringify( val );
			}
			else if ( val === null ) {
				val = 'null';
			}
			else { // type === 'object'
				val = JSON.stringify( val );
			}
			if ( !isBuffer ) {
				this.push( val, this._enc );
				return;
			}
			this.push( val );
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