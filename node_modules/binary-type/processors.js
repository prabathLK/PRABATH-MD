var LINE_FEED = 10;

/**
  Removes unnecessary line feeds from the start of a buffer. If a file signature expects a line feed
  (ie. Bitcoin wallet file), then it should just start checking from the bytes after the feed
 **/
function trimLineFeeds(buffer) {
  if (!buffer || !Buffer.isBuffer(buffer) || buffer.length <= 0) return buffer;

  // Trim all line feeds from the start of the buffer
  var idx = 0;
  while (idx < buffer.length) {
    if (buffer[idx] !== LINE_FEED) break;
    idx++;
  }

  // Return the trimmed buffer
  return (idx === 0 ? buffer : buffer.slice(idx, buffer.length));
}

var processors = [trimLineFeeds];
module.exports = function(buffer) {
  return processors.reduce(function(memo, processor) {
    return processor(memo);
  }, buffer);
};