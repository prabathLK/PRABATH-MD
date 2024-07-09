var util = require('util');

// Error list with code and message
var list = {
	'empty_input_filepath'							: { 'code' : 100, 'msg' : 'The input file path can not be empty' }
  , 'input_filepath_must_be_string'					: { 'code' : 101, 'msg' : 'The input file path must be a string' }
  , 'invalid_option_name'							: { 'code' : 102, 'msg' : 'The option "%s" is invalid. Check the list of available options' }
  , 'fileinput_not_exist'							: { 'code' : 103, 'msg' : 'The input file does not exist' }
  , 'format_not_supported'							: { 'code' : 104, 'msg' : 'The format "$s" is not supported by the version of ffmpeg' }
  , 'audio_channel_is_invalid'						: { 'code' : 105, 'msg' : 'The audio channel "$s" is not valid' }
  , 'mkdir'											: { 'code' : 106, 'msg' : 'Error occurred during creation folder: $s' }
  , 'extract_frame_invalid_everyN_options'			: { 'code' : 107, 'msg' : 'You can specify only one option between everyNFrames and everyNSeconds' }
  , 'invalid_watermark'								: { 'code' : 108, 'msg' : 'The watermark "%s" does not exists' }
  , 'invalid_watermark_position'					: { 'code' : 109, 'msg' : 'Invalid watermark position "%s"' }
  , 'size_format'									: { 'code' : 110, 'msg' : 'The format "%s" not supported by the function "setSize"' }
  , 'resolution_square_not_defined'					: { 'code' : 111, 'msg' : 'The resolution for pixel aspect ratio is not defined' }
  , 'command_already_exists'						: { 'code' : 112, 'msg' : 'The command "%s" already exists' }
  , 'codec_not_supported'							: { 'code' : 113, 'msg' : 'The codec "$s" is not supported by the version of ffmpeg' }
}

/**
 * Return the error by the codename
 */
var renderError = function (codeName) {
	// Get the error object by the codename
	var params = [list[codeName].msg];
	// Get the possible arguments
	if (arguments.length > 1)
		params = params.concat(Array.prototype.slice.call(arguments, 1));
	// Call the function for replace the letter '%s' with the found arguments
	return { 'code' : list[codeName].code, 'msg' : util.format.apply(this, params) };
}

module.exports.list = list;
module.exports.renderError = renderError;