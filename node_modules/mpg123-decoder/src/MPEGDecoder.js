import { WASMAudioDecoderCommon } from "@wasm-audio-decoders/common";

import EmscriptenWASM from "./EmscriptenWasm.js";

export default function MPEGDecoder(options = {}) {
  // injects dependencies when running as a web worker
  // async
  this._init = () => {
    return new this._WASMAudioDecoderCommon()
      .instantiate(this._EmscriptenWASM, this._module)
      .then((common) => {
        this._common = common;

        this._sampleRate = 0;

        this._inputBytes = 0;
        this._outputSamples = 0;
        this._frameNumber = 0;

        this._input = this._common.allocateTypedArray(
          this._inputSize,
          Uint8Array,
        );

        this._output = this._common.allocateTypedArray(
          this._outputChannels * this._outputChannelSize,
          Float32Array,
        );

        this._inputPosition = this._common.allocateTypedArray(1, Uint32Array);
        this._samplesDecoded = this._common.allocateTypedArray(1, Uint32Array);
        this._sampleRateBytes = this._common.allocateTypedArray(1, Uint32Array);
        this._errorStringPtr = this._common.allocateTypedArray(1, Uint32Array);

        this._decoder = this._common.wasm.mpeg_frame_decoder_create();
      });
  };

  Object.defineProperty(this, "ready", {
    enumerable: true,
    get: () => this._ready,
  });

  // async
  this.reset = () => {
    this.free();
    return this._init();
  };

  this.free = () => {
    this._common.wasm.mpeg_frame_decoder_destroy(this._decoder);
    this._common.wasm.free(this._decoder);

    this._common.free();
  };

  this._decode = (data, decodeInterval) => {
    if (!(data instanceof Uint8Array))
      throw Error(
        "Data to decode must be Uint8Array. Instead got " + typeof data,
      );

    this._input.buf.set(data);
    this._inputPosition.buf[0] = 0;
    this._samplesDecoded.buf[0] = 0;

    const error = this._common.wasm.mpeg_decode_interleaved(
      this._decoder,
      this._input.ptr,
      data.length,
      this._inputPosition.ptr,
      decodeInterval,
      this._output.ptr,
      this._outputChannelSize,
      this._samplesDecoded.ptr,
      this._sampleRateBytes.ptr,
      this._errorStringPtr.ptr,
    );

    const errors = [];

    if (error) {
      const message =
        error + " " + this._common.codeToString(this._errorStringPtr.buf[0]);

      console.error("mpg123-decoder: " + message);
      this._common.addError(
        errors,
        message,
        this._inputPosition.buf[0],
        this._frameNumber,
        this._inputBytes,
        this._outputSamples,
      );
    }

    const samplesDecoded = this._samplesDecoded.buf[0];
    this._sampleRate = this._sampleRateBytes.buf[0];

    this._inputBytes += this._inputPosition.buf[0];
    this._outputSamples += samplesDecoded;

    return this._WASMAudioDecoderCommon.getDecodedAudio(
      errors,
      [
        this._output.buf.slice(0, samplesDecoded),
        this._output.buf.slice(
          this._outputChannelSize,
          this._outputChannelSize + samplesDecoded,
        ),
      ],
      samplesDecoded,
      this._sampleRate,
    );
  };

  this.decode = (data) => {
    let output = [],
      errors = [],
      samples = 0,
      offset = 0;

    for (; offset < data.length; offset += this._inputPosition.buf[0]) {
      const decoded = this._decode(
        data.subarray(offset, offset + this._input.len),
        48,
      );

      output.push(decoded.channelData);
      errors = errors.concat(decoded.errors);
      samples += decoded.samplesDecoded;
    }

    return this._WASMAudioDecoderCommon.getDecodedAudioMultiChannel(
      errors,
      output,
      2,
      samples,
      this._sampleRate,
    );
  };

  this.decodeFrame = (mpegFrame) => {
    const decoded = this._decode(mpegFrame, mpegFrame.length);
    this._frameNumber++;
    return decoded;
  };

  this.decodeFrames = (mpegFrames) => {
    let output = [],
      errors = [],
      samples = 0,
      i = 0;

    while (i < mpegFrames.length) {
      const decoded = this.decodeFrame(mpegFrames[i++]);

      output.push(decoded.channelData);
      errors = errors.concat(decoded.errors);
      samples += decoded.samplesDecoded;
    }

    return this._WASMAudioDecoderCommon.getDecodedAudioMultiChannel(
      errors,
      output,
      2,
      samples,
      this._sampleRate,
    );
  };

  // constructor

  // injects dependencies when running as a web worker
  this._isWebWorker = MPEGDecoder.isWebWorker;
  this._WASMAudioDecoderCommon =
    MPEGDecoder.WASMAudioDecoderCommon || WASMAudioDecoderCommon;
  this._EmscriptenWASM = MPEGDecoder.EmscriptenWASM || EmscriptenWASM;
  this._module = MPEGDecoder.module;

  this._inputSize = 2 ** 18;
  this._outputChannelSize = 1152 * 512;
  this._outputChannels = 2;

  this._ready = this._init();

  return this;
}
