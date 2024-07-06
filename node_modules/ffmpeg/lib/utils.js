var exec	= require('child_process').exec
  , fs		= require('fs')
  , path	= require('path');

var errors	= require('./errors');

/**
 * Exec the list of commands and call the callback function at the end of the process
 */
module.exports.exec = function (commands, settings, callback) {
	// Create final command line
	var finalCommand = commands.join(" ");
	// Create the timeoutId for stop the timeout at the end the process
	var timeoutID = null;
	// Exec the command
	var process = exec(finalCommand, settings, function (error, stdout, stderr) {
		// Clear timeout if 'timeoutID' are setted
		if (timeoutID !== null) clearTimeout(timeoutID);
		// Call the callback function
		callback(error, stdout, stderr);
	});
	// Verify if the timeout are setting
	if (settings.timeout > 0) {
		// Set the timeout
		timeoutID = setTimeout(function () {
			process.kill();
		}, 100);		
	}
}

/**
 * Check if object is empty
 */
module.exports.isEmptyObj = function (obj) {
	// Scan all properties
    for(var prop in obj)
		// Check if obj has a property
        if(obj.hasOwnProperty(prop))
			// The object is not empty
            return false;
	// The object is empty
    return true;
}

/**
 * Merge obj1 into obj
 */
module.exports.mergeObject = function (obj, obj1) {
	// Check if there are options set
	if (!module.exports.isEmptyObj(obj1)) {
		// Scan all settings
		for (var key in obj1) {
			// Check if the option is valid
			if (!obj.hasOwnProperty(key))
				throw errors.renderError('invalid_option_name', key);
			// Set new option value
			obj[key] = obj1[key];
		}
	}
}

/**
 * Calculate the duration in seconds from the string retrieved by the ffmpeg info
 */
module.exports.durationToSeconds = function(duration) {
	var parts = duration.substr(0,8).split(':');
	return parseInt(parts[0], 10) * 3600 + parseInt(parts[1], 10) * 60 + parseInt(parts[2], 10);
};

/**
 * Calculate the greatest common divisor
 */
module.exports.gcd = function (a, b) { 
	if (b === 0) return a;
	return module.exports.gcd(b, a % b);
}

/**
 * Offers functionality similar to mkdir -p
 */
module.exports.mkdir = function (dirpath, mode, callback, position) {
	// Split all directories
    var parts = path.normalize(dirpath).split('/');
	// If the first part is empty then remove this part
	if (parts[0] == "") 
		parts = parts.slice(1);
	
	// Set the initial configuration
    mode = mode || 0777;
    position = position || 0;
	
	// Check se current position is greater than the list of folders
	if (position > parts.length) {
		// If isset the callback then it will be invoked
		if (callback) 
			callback();
		// Exit and return a positive value
		return true;
	}

	// Build the directory path
	var directory = (dirpath.charAt(0) == '/' ? '/' : '') + parts.slice(0, position + 1).join('/');

	// Check if directory exists
	if (fs.existsSync(directory)) {
		module.exports.mkdir(dirpath, mode, callback, position + 1);
	} else {
		if (fs.mkdirSync(directory, mode)) {
			// If isset the callback then it will be invoked
			if (callback) 
				callback(errors.renderError('mkdir', directory));
			// Send the new exception
			throw errors.renderError('mkdir', directory);
		} else {
			module.exports.mkdir(dirpath, mode, callback, position + 1);
		}
	}
}

/**
 * Check if a value is present inside an array
 */
module.exports.in_array = function (value, array) {
	// Scan all element
	for (var i in array)
		// Check if value exists
		if (array[i] == value)
			// Return the position of value
			return i;
	// The value not exists
	return false;
}