/**
  # buffer-url

  Generate a usable url for a valid node style buffer

  ## Usage

  ### `createUrl(buffer, mimetype?)` => String

  Create a url that can be used as a `src` attribute of a `<video>`, `<audio>`
  or `<image>` element from the binary `buffer` provided.  If the `mimetype`
  has been provided, then this will be used to create teh buffer, but if
  not the [`binary-type`](https://github.com/DamonOehlman/binary-type)
  package will be used to help out.

**/
module.exports = function(buffer, mimetype) {
  var blob = new Blob([buffer], {
    type: mimetype || require('binary-type').guess(buffer)
  });

  // create the object url
  return URL.createObjectURL(blob);
};
