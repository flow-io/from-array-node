/**
*
*	VALIDATE: options
*
*
*	DESCRIPTION:
*		- Validates readable stream options.
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

	var isObject = require( 'validate.io-object' );


	// VARIABLES //

	var validators = {
		'encoding': validEncoding,
		'highWaterMark': validHighWaterMark,
		'objectMode': validObjectMode
	};


	// FUNCTIONS //

	/**
	* FUNCTION: validate( options )
	*	Validates stream options.
	*
	* @private
	* @param {Object} options - Readable stream options
	* @returns {Null|TypeError} null if valid or TypeError if invalid
	*/
	function validate( options ) {
		var validator,
			keys,
			key,
			err;

		if ( !isObject( options ) ) {
			return new TypeError( 'Stream()::invalid input argument. Options must be an object.' );
		}
		keys = Object.keys( options );
		for ( var i = 0; i < keys.length; i++ ) {
			key = keys[ i ];
			validator = validators[ key ];
			err = validator( options[key] );
			if ( err ) {
				return err;
			}
		}
	} // end FUNCTION validate()

	/**
	* FUNCTION: validEncoding( value )
	*	Validates the stream encoding option.
	*
	* @private
	* @param {String|Null} value - stream encoding
	* @return {Null|TypeError} null if valid or TypeError if invalid
	*/
	function validEncoding( value ) {
		if ( typeof value !== 'string' && value !== null ) {
			return new TypeError( 'Stream()::invalid input argument. Encoding must be a string or null.' );
		}
		return null;
	} // end FUNCTION validEncoding()

	/**
	* FUNCTION: validHighWaterMark( value )
	*	Validates the stream high watermark option.
	*
	* @private
	* @param {Number} value - stream high watermark
	* @return {Null|TypeError} null if valid or TypeError if invalid
	*/
	function validHighWaterMark( value ) {
		if ( typeof value !== 'number' || value !== value || value < 0 ) {
			return new TypeError( 'Stream()::invalid input argument. High watermark must be numeric and greater than 0.' );
		}
		return null;
	} // end FUNCTION validHighWaterMark()

	/**
	* FUNCTION: validObjectMode( value )
	*	Validates the stream objectMode option.
	*
	* @private
	* @param {Boolean} value - stream objectMode option
	* @return {Null|TypeError} null if valid or TypeError if invalid
	*/
	function validObjectMode( value ) {
		if ( typeof value !== 'boolean' ) {
			return new TypeError( 'Stream()::invalid input argument. objectMode must be a boolean.' );
		}
		return null;
	} // end FUNCTION validObjectMode()


	// EXPORTS //

	module.exports = validate;

})();