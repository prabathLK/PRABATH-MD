tesseract.js-core
=================

![](https://raw.githubusercontent.com/jeromewu/tesseract.js-core/master/assets/images/tesseract.js-core.png)

Core part of [tesseract.js](https://github.com/naptha/tesseract.js), which compiles original tesseract from C to JavaScript WebAssembly.

## Environment

- Emscripten: 1.39.10 (trzeci/emscripten:1.39.10-upstream)
- Leptonica: 1.74.2
  - zlib: 1.2.5
  - libtiff: 3.9.4
  - libjpeg: 8.4.0
  - libpng: 1.4.22
- Tesseract: 4.1.1

## Contribution

As we leverage git-submodule to manage dependencies, remember to add recursive when cloning the repository:

```
$ git clone --recursive https://github.com/naptha/tesseract.js-core
```

To build tesseract-core.js by yourself, please install [docker](https://www.docker.com/) and run:

```
$ sh build.sh
```

The genreated files will be stored in root path.
