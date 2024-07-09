var fs			= require('fs')
  , path		= require('path')
  , when		= require('when');

var errors		= require('./errors')
  , presets		= require('./presets')
  , utils		= require('./utils');

module.exports = function (filePath, settings, infoConfiguration, infoFile) {
	
	// Public info about file and ffmpeg configuration
	this.file_path				= filePath;
	this.info_configuration		= infoConfiguration;
	this.metadata				= infoFile;
	
	// Commands for building the ffmpeg string conversion
	var commands		= new Array()
	  , inputs			= new Array()
	  , filtersComlpex	= new Array()
	  , output			= null;
	
	// List of options generated from setting functions
	var options			= new Object();
	
	/*****************************************/
	/* FUNCTION FOR FILL THE COMMANDS OBJECT */
	/*****************************************/
	
	/**
	 * Add a command to be bundled into the ffmpeg command call
	 */
	this.addCommand = function (command, argument) {
		// Check if exists the current command
		if (utils.in_array(command, commands) === false) {
			// Add the new command
			commands.push(command);
			// Add the argument to new command
			if (argument != undefined)
				commands.push(argument);
		} else 
			throw errors.renderError('command_already_exists', command);
	}
	
	/**
	 * Add an input stream
	 */
	this.addInput = function (argument) {
		inputs.push(argument);
	}
	
	/**
	 * Add a filter complex
	 */
	this.addFilterComplex = function (argument) {
		filtersComlpex.push(argument);
	}
	
	/**
	 * Set the output path
	 */
	var setOutput = function (path) {
		output = path;
	}
	
	/*********************/
	/* SETTING FUNCTIONS */
	/*********************/
	
	/**
	 * Disables audio encoding
	 */
	this.setDisableAudio = function () {
		if (options.audio == undefined)
			options.audio = new Object();
		// Set the new option
		options.audio.disabled = true;
		return this;
	}

	/**
	 * Disables video encoding
	 */
	this.setDisableVideo = function () {
		if (options.video == undefined)
			options.video = new Object();
		// Set the new option
		options.video.disabled = true;
		return this;
	}
	
	/**
	 * Sets the new video format
	 */
	this.setVideoFormat = function (format) {
		// Check if the format is supported by ffmpeg version
		if (this.info_configuration.encode.indexOf(format) != -1) {
			if (options.video == undefined)
				options.video = new Object();
			// Set the new option
			options.video.format = format;
			return this;
		} else 
			throw errors.renderError('format_not_supported', format);
	}
	
	/**
	 * Sets the new audio codec
	 */
	this.setVideoCodec = function (codec) {
		// Check if the codec is supported by ffmpeg version
		if (this.info_configuration.encode.indexOf(codec) != -1) {
			if (options.video == undefined)
				options.video = new Object();
			// Set the new option
			options.video.codec = codec;
			return this;
		} else 
			throw errors.renderError('codec_not_supported', codec);
	}
	
	/**
	 * Sets the video bitrate
	 */
	this.setVideoBitRate = function (bitrate) {
		if (options.video == undefined)
			options.video = new Object();
		// Set the new option
		options.video.bitrate = bitrate;
		return this;
	}
	
	/**
	 * Sets the framerate of the video
	 */
	this.setVideoFrameRate = function (framerate) {
		if (options.video == undefined)
			options.video = new Object();
		// Set the new option
		options.video.framerate = framerate;
		return this;		
	}
	
	/**
	 * Sets the start time
	 */
	this.setVideoStartTime = function (time) {
		if (options.video == undefined)
			options.video = new Object();
		
		// Check if time is a string that contain: hours, minutes and seconds
		if (isNaN(time) && /([0-9]+):([0-9]{2}):([0-9]{2})/.exec(time)) {
			time = utils.durationToSeconds(time);			
		} else if (!isNaN(time) && parseInt(time) == time) {
			time = parseInt(time, 10);			
		} else {
			time = 0;			
		}

		// Set the new option
		options.video.startTime = time;
		return this;
	}
	
	/**
	 * Sets the duration
	 */
	this.setVideoDuration = function (duration) {
		if (options.video == undefined)
			options.video = new Object();
		
		// Check if duration is a string that contain: hours, minutes and seconds
		if (isNaN(duration) && /([0-9]+):([0-9]{2}):([0-9]{2})/.exec(duration)) {
			duration = utils.durationToSeconds(duration);
		} else if (!isNaN(duration) && parseInt(duration) == duration) {
			duration = parseInt(duration, 10);			
		} else {
			duration = 0;
		}

		// Set the new option
		options.video.duration = duration;
		return this;
	}
	
	/**
	 * Sets the new aspetc ratio
	 */
	this.setVideoAspectRatio = function (aspect) {
		// Check if aspect is a string
		if (isNaN(aspect)) {
			// Check if aspet is string xx:xx
			if (/([0-9]+):([0-9]+)/.exec(aspect)) {
				var check = /([0-9]+):([0-9]+)/.exec(aspect);
				aspect = parseFloat((check[1] / check[2]));
			} else {
				aspect = this.metadata.video.aspect.value;
			}
		}
		
		if (options.video == undefined)
			options.video = new Object();
		// Set the new option
		options.video.aspect = aspect;
		return this;
	}
	
	/**
	 * Set the size of the video
	 */
	this.setVideoSize = function (size, keepPixelAspectRatio, keepAspectRatio, paddingColor) {
		if (options.video == undefined)
			options.video = new Object();
		// Set the new option
		options.video.size = size;
		options.video.keepPixelAspectRatio = keepPixelAspectRatio;
		options.video.keepAspectRatio = keepAspectRatio;
		options.video.paddingColor = paddingColor;
		return this;
	}
	
	/**
	 * Sets the new audio codec
	 */
	this.setAudioCodec = function (codec) {
		// Check if the codec is supported by ffmpeg version
		if (this.info_configuration.encode.indexOf(codec) != -1) {
			// Check if codec is equal 'MP3' and check if the version of ffmpeg support the libmp3lame function
			if (codec == 'mp3' && this.info_configuration.modules.indexOf('libmp3lame') != -1)
				codec = 'libmp3lame';
			
			if (options.audio == undefined)
				options.audio = new Object();
			// Set the new option
			options.audio.codec = codec;
			return this;
		} else 
			throw errors.renderError('codec_not_supported', codec);
	}
	
	/**
	 * Sets the audio sample frequency for audio outputs
	 */
	this.setAudioFrequency = function (frequency) {
		if (options.audio == undefined)
			options.audio = new Object();
		// Set the new option
		options.audio.frequency = frequency;
		return this;
	}
	
	/**
	 * Sets the number of audio channels
	 */
	this.setAudioChannels = function (channel) {
		// Check if the channel value is valid
		if (presets.audio_channel.stereo == channel || presets.audio_channel.mono == channel) {
			if (options.audio == undefined)
				options.audio = new Object();
			// Set the new option
			options.audio.channel = channel;
			return this;			
		} else 
			throw errors.renderError('audio_channel_is_invalid', channel);
	}
	
	/**
	 * Sets the audio bitrate
	 */
	this.setAudioBitRate = function (bitrate) {
		if (options.audio == undefined)
			options.audio = new Object();
		// Set the new option
		options.audio.bitrate = bitrate;
		return this;
	}
	
	/**
	 * Sets the audio quality
	 */
	this.setAudioQuality = function (quality) {
		if (options.audio == undefined)
			options.audio = new Object();
		// Set the new option
		options.audio.quality = quality;
		return this;
	}
	
	/**
	 * Sets the watermark
	 */
	this.setWatermark = function (watermarkPath, settings) {
		// Base settings
		var baseSettings = {
			position		: "SW"		// Position: NE NC NW SE SC SW C CE CW
		  , margin_nord		: null		// Margin nord
		  , margin_sud		: null		// Margin sud
		  , margin_east		: null		// Margin east
		  , margin_west		: null		// Margin west
		};
		
		// Check if watermark exists
		if (!fs.existsSync(watermarkPath))
			throw errors.renderError('invalid_watermark', watermarkPath);
		
		// Check if the settings are specified
		if (settings != null)
			utils.mergeObject(baseSettings, settings);
		
		// Check if position is valid
		if (baseSettings.position == null || utils.in_array(baseSettings.position, ['NE','NC','NW','SE','SC','SW','C','CE','CW']) === false)
			throw errors.renderError('invalid_watermark_position', baseSettings.position);
		
		// Check if margins are valid
		
		if (baseSettings.margin_nord == null || isNaN(baseSettings.margin_nord))
			baseSettings.margin_nord = 0;
		if (baseSettings.margin_sud == null || isNaN(baseSettings.margin_sud))
			baseSettings.margin_sud = 0;
		if (baseSettings.margin_east == null || isNaN(baseSettings.margin_east))
			baseSettings.margin_east = 0;
		if (baseSettings.margin_west == null || isNaN(baseSettings.margin_west))
			baseSettings.margin_west = 0;
		
		var overlay = '';
		
		var getSing = function (val, inverse) {
			return (val > 0 ? (inverse ? '-' : '+') : (inverse ? '+' : '-')).toString() + Math.abs(val).toString();
		}
		
		var getHorizontalMargins = function (east, west) {
			return getSing(east, false).toString() + getSing(west, true).toString();
		}
		
		var getVerticalMargins = function (nord, sud) {
			return getSing(nord, false).toString() + getSing(sud, true).toString();
		}
		
		// Calculate formula		
		switch (baseSettings.position) {
			case 'NE':
				overlay = '0' + getHorizontalMargins(baseSettings.margin_east, baseSettings.margin_west) + ':0' + getVerticalMargins(baseSettings.margin_nord, baseSettings.margin_sud);
				break;
			case 'NC':
				overlay = 'main_w/2-overlay_w/2' + getHorizontalMargins(baseSettings.margin_east, baseSettings.margin_west) + ':0' + getVerticalMargins(baseSettings.margin_nord, baseSettings.margin_sud);
				break;
			case 'NW':
				overlay = 'main_w-overlay_w' + getHorizontalMargins(baseSettings.margin_east, baseSettings.margin_west) + ':0' + getVerticalMargins(baseSettings.margin_nord, baseSettings.margin_sud);
				break;
			case 'SE':
				overlay = '0' + getHorizontalMargins(baseSettings.margin_east, baseSettings.margin_west) + ':main_h-overlay_h' + getVerticalMargins(baseSettings.margin_nord, baseSettings.margin_sud);
				break;
			case 'SC':
				overlay = 'main_w/2-overlay_w/2' + getHorizontalMargins(baseSettings.margin_east, baseSettings.margin_west) + ':main_h-overlay_h' + getVerticalMargins(baseSettings.margin_nord, baseSettings.margin_sud);
				break;
			case 'SW':
				overlay = 'main_w-overlay_w' + getHorizontalMargins(baseSettings.margin_east, baseSettings.margin_west) + ':main_h-overlay_h' + getVerticalMargins(baseSettings.margin_nord, baseSettings.margin_sud);
				break;
			case 'CE':
				overlay = '0' + getHorizontalMargins(baseSettings.margin_east, baseSettings.margin_west) + ':main_h/2-overlay_h/2' + getVerticalMargins(baseSettings.margin_nord, baseSettings.margin_sud);
				break;
			case 'C':
				overlay = 'main_w/2-overlay_w/2' + getHorizontalMargins(baseSettings.margin_east, baseSettings.margin_west) + ':main_h/2-overlay_h/2' + getVerticalMargins(baseSettings.margin_nord, baseSettings.margin_sud);
				break;
			case 'CW':
				overlay = 'main_w-overlay_w' + getHorizontalMargins(baseSettings.margin_east, baseSettings.margin_west) + ':main_h/2-overlay_h/2' + getVerticalMargins(baseSettings.margin_nord, baseSettings.margin_sud);
				break;
		}
		
		// Check if the call comes from internal function
		if (arguments[2] == undefined || arguments[2] == null) {
			if (options.video == undefined)
				options.video = new Object();
			// Set the new option
			options.video.watermark = { path : watermarkPath, overlay : overlay };
			return this;
		} else if (arguments[2] != undefined && arguments[2] === true) {
			this.addInput(watermarkPath);
			this.addFilterComplex('overlay=' + overlay);
		}
	}
	
	/**
	 * Save all set commands
	 */
	this.save = function (destionationFileName, callback) {
		// Check if the 'video' is present in the options
		if (options.hasOwnProperty('video')) {
			// Check if video is disabled
			if (options.video.hasOwnProperty('disabled')) {
				this.addCommand('-vn');				
			} else {
				// Check all video property
				if (options.video.hasOwnProperty('format'))
					this.addCommand('-f', options.video.format);
				if (options.video.hasOwnProperty('codec'))
					this.addCommand('-vcodec', options.video.codec);
				if (options.video.hasOwnProperty('bitrate'))
					this.addCommand('-b', parseInt(options.video.bitrate, 10) + 'kb');
				if (options.video.hasOwnProperty('framerate'))
					this.addCommand('-r', parseInt(options.video.framerate, 10));
				if (options.video.hasOwnProperty('startTime'))
					this.addCommand('-ss', parseInt(options.video.startTime, 10));
				if (options.video.hasOwnProperty('duration'))
					this.addCommand('-t', parseInt(options.video.duration, 10));
				
				if (options.video.hasOwnProperty('watermark')) {
					this.addInput(options.video.watermark.path);
					this.addFilterComplex('overlay=' + options.video.watermark.overlay);
				}
				
				// Check if the video should be scaled
				if (options.video.hasOwnProperty('size')) {
					var newDimension = _calculateNewDimension.call(this);
					
					if (newDimension.aspect != null) {
						this.addFilterComplex('scale=iw*sar:ih, pad=max(iw\\,ih*(' + newDimension.aspect.x + '/' + newDimension.aspect.y + ')):ow/(' + newDimension.aspect.x + '/' + newDimension.aspect.y + '):(ow-iw)/2:(oh-ih)/2' + (options.video.paddingColor != null ? ':' + options.video.paddingColor : ''));
						this.addCommand('-aspect', newDimension.aspect.string);
					}
					
					this.addCommand('-s', newDimension.width + 'x' + newDimension.height);
				}
			}
		}
		// Check if the 'audio' is present in the options
		if (options.hasOwnProperty('audio')) {
			// Check if audio is disabled
			if (options.audio.hasOwnProperty('disabled')) {
				this.addCommand('-an');				
			} else {
				// Check all audio property
				if (options.audio.hasOwnProperty('codec'))
					this.addCommand('-acodec', options.audio.codec);
				if (options.audio.hasOwnProperty('frequency'))
					this.addCommand('-ar', parseInt(options.audio.frequency));
				if (options.audio.hasOwnProperty('channel'))
					this.addCommand('-ac', options.audio.channel);
				if (options.audio.hasOwnProperty('quality'))
					this.addCommand('-aq', options.audio.quality);
				if (options.audio.hasOwnProperty('bitrate'))
					this.addCommand('-ab', parseInt(options.audio.bitrate, 10) + 'k');
			}
		}
		
		setOutput(destionationFileName);
		
		return execCommand.call(this, callback);
	}
	
	/*********************/
	/* INTERNAL FUNCTION */
	/*********************/
	
	/**
	 * Reset the list of commands
	 */
	var resetCommands = function (self) {
		commands		= new Array()
		inputs			= [self.file_path];
		filtersComlpex	= new Array();
		output			= null;
		options			= new Object();
	}

	/**
	 * Calculate width, height and aspect ratio by the new dimension data
	 */
	var _calculateNewDimension = function () {
		// Check if keepPixelAspectRatio is undefined
		var keepPixelAspectRatio = typeof options.video.keepPixelAspectRatio != 'boolean' ? false : options.video.keepPixelAspectRatio;
		// Check if keepAspectRatio is undefined
		var keepAspectRatio = typeof options.video.keepAspectRatio != 'boolean' ? false : options.video.keepAspectRatio;
		
		// Resolution to be taken as a reference
		var referrerResolution = this.metadata.video.resolution;
		// Check if is need keep pixel aspect ratio
		if (keepPixelAspectRatio) {
			// Check if exists resolution for pixel aspect ratio
			if (utils.isEmptyObj(this.metadata.video.resolutionSquare))
				throw errors.renderError('resolution_square_not_defined');
			
			// Apply the resolutionSquare
			referrerResolution = this.metadata.video.resolutionSquare;
		}
		
		// Final data
		var width	= null
		  , height	= null
		  , aspect	= null;

		// Regex to check which type of dimension was specified
		var fixedWidth		= /([0-9]+)x\?/.exec(options.video.size)
		  , fixedHeight		= /\?x([0-9]+)/.exec(options.video.size)
		  , percentage		= /([0-9]{1,2})%/.exec(options.video.size)
		  , classicSize		= /([0-9]+)x([0-9]+)/.exec(options.video.size);
		  
		if (fixedWidth) {
			// Set the width dimension
			width = parseInt(fixedWidth[1], 10);			
			// Check if the video has the aspect ratio setted
			if (!utils.isEmptyObj(this.metadata.video.aspect)) {
				height = Math.round((width / this.metadata.video.aspect.x) * this.metadata.video.aspect.y);
			} else {
				// Calculte the new height
				height = Math.round(referrerResolution.h / (referrerResolution.w / parseInt(fixedWidth[1], 10)));
			}
		} else if (fixedHeight) {
			// Set the width dimension
			height = parseInt(fixedHeight[1], 10);			
			// Check if the video has the aspect ratio setted
			if (!utils.isEmptyObj(this.metadata.video.aspect)) {
				width = Math.round((height / this.metadata.video.aspect.y) * this.metadata.video.aspect.x);
			} else {
				// Calculte the new width
				width = Math.round(referrerResolution.w / (referrerResolution.h / parseInt(fixedHeight[1], 10)));
			}			
		} else if (percentage) {
			// Calculte the ratio from percentage
			var ratio = parseInt(percentage[1], 10) / 100;
			// Calculate the new dimensions
			width = Math.round(referrerResolution.w * ratio);
			height = Math.round(referrerResolution.h * ratio);
		} else if (classicSize) {
			width = parseInt(classicSize[1], 10);
			height = parseInt(classicSize[2], 10);
		} else 
			throw errors.renderError('size_format', options.video.size);
		
		// If the width or height are not multiples of 2 will be decremented by one unit
		if (width % 2 != 0) width -= 1;
		if (height % 2 != 0) height -= 1;
		
		if (keepAspectRatio) {
			// Calculate the new aspect ratio
			var gcdValue	= utils.gcd(width, height);
			
			aspect = new Object();
			aspect.x = width / gcdValue;
			aspect.y = height / gcdValue;
			aspect.string = aspect.x + ':' + aspect.y;
		}
		
		return { width : width, height : height, aspect : aspect };
	}
	
	/**
	 * Executing the commands list
	 */
	var execCommand = function (callback, folder) {
		// Checking if folder is defined
		var onlyDestinationFile = folder != undefined ? false : true;
		// Building the value for return value. Check if the callback is not a function. In this case will created a new instance of the deferred class
		var deferred = typeof callback != 'function' ? when.defer() : { promise : null };
		// Create a copy of the commands list
		var finalCommands = ['ffmpeg -i']
			.concat(inputs.join(' -i '))
			.concat(commands.join(' '))
			.concat(filtersComlpex.length > 0 ? ['-filter_complex "'].concat(filtersComlpex.join(', ')).join('') + '"' : [])
			.concat([output]);
		// Reset commands
		resetCommands(this);
		// Execute the commands from the list
		utils.exec(finalCommands, settings, function (error, stdout, stderr) {
			// Building the result
			var result = null;
			if (!error) {
				// Check if show only destination filename or the complete file list
				if (onlyDestinationFile) {
					result = finalCommands[finalCommands.length-1];
				} else {
					// Clean possible "/" at the end of the string
					if (folder.charAt(folder.length-1) == "/")
						folder = folder.substr(0, folder.length-1);
					// Read file list inside the folder
					result = fs.readdirSync(folder);
					// Scan all file and prepend the folder path
					for (var i in result)
						result[i] = [folder, result[i]].join('/')
				}
			}
			// Check if the callback is a function
			if (typeof callback == 'function') {
				// Call the callback to return the info
				callback(error, result);
			} else {
				if (error) {
					// Negative response
					deferred.reject(error);
				} else {
					// Positive response
					deferred.resolve(result);
				}
			}
		});
		// Return a possible promise instance
		return deferred.promise;
	}
	
	/*******************/
	/* PRESET FUNCTION */
	/*******************/
	
	/**
	 * Extracting sound from a video, and save it as Mp3
	 */
	this.fnExtractSoundToMP3 = function (destionationFileName, callback) {
		// Check if file already exists. In this case will remove it
		if (fs.existsSync(destionationFileName)) 
			fs.unlinkSync(destionationFileName);

		// Building the final path
		var destinationDirName		= path.dirname(destionationFileName)
		  , destinationFileNameWE	= path.basename(destionationFileName, path.extname(destionationFileName)) + '.mp3'
		  , finalPath				= path.join(destinationDirName, destinationFileNameWE);
		
		resetCommands(this);
		
		// Adding commands to the list
		this.addCommand('-vn');
		this.addCommand('-ar', 44100);
		this.addCommand('-ac', 2);
		this.addCommand('-ab', 192);
		this.addCommand('-f', 'mp3');
		
		// Add destination file path to the command list
		setOutput(finalPath);
		
		// Executing the commands list
		return execCommand.call(this, callback);
	}
	
	/**
	 * Extract frame from video file
	 */
	this.fnExtractFrameToJPG = function (/* destinationFolder, settings, callback */) {
		
		var destinationFolder	= null
		  , newSettings			= null
		  , callback			= null;
		  
		var settings = {
			start_time				: null		// Start time to recording
		  , duration_time			: null		// Duration of recording
		  , frame_rate				: null		// Number of the frames to capture in one second
		  , size					: null		// Dimension each frame
		  , number					: null		// Total frame to capture
		  , every_n_frames			: null		// Frame to capture every N frames
		  , every_n_seconds			: null		// Frame to capture every N seconds
		  , every_n_percentage		: null		// Frame to capture every N percentage range
		  , keep_pixel_aspect_ratio	: true		// Mantain the original pixel video aspect ratio
		  , keep_aspect_ratio		: true		// Mantain the original aspect ratio
		  , padding_color			: 'black'	// Padding color
		  , file_name				: null		// File name
		};
		  
		// Scan all arguments
		for (var i in arguments) {
			// Check the type of the argument
			switch (typeof arguments[i]) {
				case 'string':
					destinationFolder = arguments[i];
					break;
				case 'object':
					newSettings = arguments[i];
					break;
				case 'function':
					callback = arguments[i];
					break;
			}
		}
		
		// Check if the settings are specified
		if (newSettings !== null)
			utils.mergeObject(settings, newSettings);

		// Check if 'start_time' is in the format hours:minutes:seconds
		if (settings.start_time != null) {
			if (/([0-9]+):([0-9]{2}):([0-9]{2})/.exec(settings.start_time))
				settings.start_time = utils.durationToSeconds(settings.start_time);
			else if (!isNaN(settings.start_time))
				settings.start_time = parseInt(settings.start_time, 10);
			else
				settings.start_time = null;
		}

		// Check if 'duration_time' is in the format hours:minutes:seconds
		if (settings.duration_time != null) {
			if (/([0-9]+):([0-9]{2}):([0-9]{2})/.exec(settings.duration_time))
				settings.duration_time = utils.durationToSeconds(settings.duration_time);
			else if (!isNaN(settings.duration_time))
				settings.duration_time = parseInt(settings.duration_time, 10);
			else
				settings.duration_time = null;
		}

		// Check if the value of the framerate is number type
		if (settings.frame_rate != null && isNaN(settings.frame_rate))
			settings.frame_rate = null;

		// If the size is not settings then the size of the screenshots is equal to video size
		if (settings.size == null)
			settings.size = this.metadata.video.resolution.w + 'x' + this.metadata.video.resolution.h;

		// Check if the value of the 'number frame to capture' is number type
		if (settings.number != null && isNaN(settings.number))
			settings.number = null;

		var every_n_check = 0;

		// Check if the value of the 'every_n_frames' is number type
		if (settings.every_n_frames != null && isNaN(settings.every_n_frames)) {
			settings.every_n_frames = null;
			every_n_check++;
		}

		// Check if the value of the 'every_n_seconds' is number type
		if (settings.every_n_seconds != null && isNaN(settings.every_n_seconds)) {
			settings.every_n_seconds = null;
			every_n_check++;
		}

		// Check if the value of the 'every_n_percentage' is number type
		if (settings.every_n_percentage != null && (isNaN(settings.every_n_percentage) || settings.every_n_percentage > 100)) {
			settings.every_n_percentage = null;
			every_n_check++;
		}
		
		if (every_n_check >= 2) {
			if (callback) {
				callback(errors.renderError('extract_frame_invalid_everyN_options'));
			} else {
				throw errors.renderError('extract_frame_invalid_everyN_options');
			}
		}			
		
		// If filename is null then his value is equal to original filename
		if (settings.file_name == null) {
			settings.file_name = path.basename(this.file_path, path.extname(this.file_path));
		} else {
			// Retrieve all possible replacements
			var replacements = settings.file_name.match(/(\%[a-zA-Z]{1})/g);
			// Check if exists replacements. The scan all replacements and build the final filename
			if (replacements) {
				for (var i in replacements) {
					switch (replacements[i]) {
						case '%t':
							settings.file_name = settings.file_name.replace('%t', new Date().getTime());
							break;
						case '%s':
							settings.file_name = settings.file_name.replace('%s', settings.size);
							break;
						case '%x':
							settings.file_name = settings.file_name.replace('%x', settings.size.split(':')[0]);
							break;
						case '%y':
							settings.file_name = settings.file_name.replace('%y', settings.size.split(':')[1]);
							break;
						default:
							settings.file_name = settings.file_name.replace(replacements[i], '');
							break;
					}
				}
			}
		}
		// At the filename will added the number of the frame
		settings.file_name = path.basename(settings.file_name, path.extname(settings.file_name)) + '_%d.jpg';
		
		// Create the directory to save the extracted frames
		utils.mkdir(destinationFolder, 0777);
		
		resetCommands(this);
		
		// Adding commands to the list
		if (settings.startTime)
			this.addCommand('-ss', settings.startTime);
		if (settings.duration_time)
			this.addCommand('-t', settings.duration_time);
		if (settings.frame_rate)
			this.addCommand('-r', settings.frame_rate);

		// Setting the size and padding settings
		this.setVideoSize(settings.size, settings.keep_pixel_aspect_ratio, settings.keep_aspect_ratio, settings.padding_color);
		// Get the dimensions
		var newDimension = _calculateNewDimension.call(this);
		// Apply the size and padding commands
		this.addCommand('-s', newDimension.width + 'x' + newDimension.height);
		// CHeck if isset aspect ratio options
		if (newDimension.aspect != null) {
			this.addFilterComplex('scale=iw*sar:ih, pad=max(iw\\,ih*(' + newDimension.aspect.x + '/' + newDimension.aspect.y + ')):ow/(' + newDimension.aspect.x + '/' + newDimension.aspect.y + '):(ow-iw)/2:(oh-ih)/2' + (settings.padding_color != null ? ':' + settings.padding_color : ''));
			this.addCommand('-aspect', newDimension.aspect.string);
		}

		if (settings.number)
			this.addCommand('-vframes', settings.number);
		if (settings.every_n_frames) {
			this.addCommand('-vsync', 0);					
			this.addFilterComplex('select=not(mod(n\\,' + settings.every_n_frames + '))');
		}
		if (settings.every_n_seconds) {
			this.addCommand('-vsync', 0);
			this.addFilterComplex('select=not(mod(t\\,' + settings.every_n_seconds + '))');
		}
		if (settings.every_n_percentage) {
			this.addCommand('-vsync', 0);
			this.addFilterComplex('select=not(mod(t\\,' + parseInt((this.metadata.duration.seconds / 100) * settings.every_n_percentage) + '))');
		}
		
		// Add destination file path to the command list
		setOutput([destinationFolder,settings.file_name].join('/'));

		// Executing the commands list
		return execCommand.call(this, callback, destinationFolder);
	}

	/**
	 * Add a watermark to the video and save it
	 */
	this.fnAddWatermark = function (watermarkPath /* newFilepath , settings, callback */) {

		var newFilepath		= null
		  , newSettings		= null
		  , callback		= null;
		  
		// Scan all arguments
		for (var i = 1; i < arguments.length; i++) {
			// Check the type of the argument
			switch (typeof arguments[i]) {
				case 'string':
					newFilepath = arguments[i];
					break;
				case 'object':
					newSettings = arguments[i];
					break;
				case 'function':
					callback = arguments[i];
					break;
			}
		}
		
		resetCommands(this);

		// Call the function to add the watermark options
		this.setWatermark(watermarkPath, newSettings, true);
		
		if (newFilepath == null)
			newFilepath = path.dirname(this.file_path) + '/' + 
						  path.basename(this.file_path, path.extname(this.file_path)) + '_watermark_' + 
						  path.basename(watermarkPath, path.extname(watermarkPath)) + 
						  path.extname(this.file_path);
		
		// Add destination file path to the command list
		setOutput(newFilepath);

		// Executing the commands list
		return execCommand.call(this, callback);
	}
	
	/**
	 * Constructor
	 */
	var __constructor = function (self) {
		resetCommands(self);
	}(this);
}