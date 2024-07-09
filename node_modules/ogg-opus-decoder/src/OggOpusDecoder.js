import { WASMAudioDecoderCommon } from "@wasm-audio-decoders/common";
import { OpusDecoder } from "opus-decoder";
import CodecParser, {
  codecFrames,
  header,
  channels,
  streamCount,
  coupledStreamCount,
  channelMappingTable,
  preSkip,
  isLastPage,
  absoluteGranulePosition,
  samples,
  data,
} from "codec-parser";

export default class OggOpusDecoder {
  constructor(options = {}) {
    this._sampleRate = options.sampleRate || 48000;
    this._forceStereo =
      options.forceStereo !== undefined ? options.forceStereo : false;

    this._onCodec = (codec) => {
      if (codec !== "opus")
        throw new Error(
          "ogg-opus-decoder does not support this codec " + codec,
        );
    };

    // instantiate to create static properties
    new WASMAudioDecoderCommon();
    this._decoderClass = OpusDecoder;

    this._init();
  }

  _init() {
    if (this._decoder) this._decoder.free();
    this._decoder = null;
    this._ready = Promise.resolve();

    this._codecParser = new CodecParser("application/ogg", {
      onCodec: this._onCodec,
      enableFrameCRC32: false,
    });
  }

  async _instantiateDecoder(header) {
    this._totalSamplesDecoded = 0;
    this._preSkip = header[preSkip];
    this._channels = this._forceStereo ? 2 : header[channels];
    this._beginningSampleOffset = null;

    this._decoder = new this._decoderClass({
      channels: header[channels],
      streamCount: header[streamCount],
      coupledStreamCount: header[coupledStreamCount],
      channelMappingTable: header[channelMappingTable],
      preSkip: Math.round((this._preSkip / 48000) * this._sampleRate),
      sampleRate: this._sampleRate,
      forceStereo: this._forceStereo,
    });
    await this._decoder.ready;
  }

  get ready() {
    return this._ready;
  }

  async reset() {
    this._init();
  }

  free() {
    this._init();
  }

  async _decode(oggPages) {
    let allErrors = [],
      allChannelData = [],
      samplesThisDecode = 0;

    for await (const oggPage of oggPages) {
      // only decode Ogg pages that have codec frames
      const frames = oggPage[codecFrames].map((f) => f[data]);

      if (frames.length) {
        // wait until there is an Opus header before instantiating
        if (!this._decoder)
          await this._instantiateDecoder(oggPage[codecFrames][0][header]);

        const { channelData, samplesDecoded, errors } =
          await this._decoder.decodeFrames(frames);

        this._totalSamplesDecoded += samplesDecoded;

        // record beginning sample offset for absoluteGranulePosition logic
        if (
          this._beginningSampleOffset === null &&
          Number(oggPage[absoluteGranulePosition]) > -1
        ) {
          this._beginningSampleOffset =
            oggPage[absoluteGranulePosition] -
            BigInt(oggPage[samples]) +
            BigInt(this._preSkip);
        }

        if (oggPage[isLastPage]) {
          // in cases where BigInt isn't supported, don't do any absoluteGranulePosition logic (i.e. old iOS versions)
          if (oggPage[absoluteGranulePosition] !== undefined) {
            const totalDecodedSamples_48000 =
              (this._totalSamplesDecoded / this._sampleRate) * 48000;
            const totalOggSamples_48000 = Number(
              oggPage[absoluteGranulePosition] - this._beginningSampleOffset,
            );

            // trim any extra samples that are decoded beyond the absoluteGranulePosition, relative to where we started in the stream
            const samplesToTrim = Math.round(
              ((totalDecodedSamples_48000 - totalOggSamples_48000) / 48000) *
                this._sampleRate,
            );

            for (let i = 0; i < channelData.length; i++) {
              channelData[i] = channelData[i].subarray(
                0,
                samplesDecoded - samplesToTrim,
              );
            }

            samplesThisDecode -= samplesToTrim;
          }
          // reached the end of an ogg stream, reset the decoder
          this._init();
        }

        allErrors.push(...errors);
        allChannelData.push(channelData);
        samplesThisDecode += samplesDecoded;
      }
    }

    return [
      allErrors,
      allChannelData,
      this._channels,
      samplesThisDecode,
      this._sampleRate,
      16,
    ];
  }

  _parse(oggOpusData) {
    return [...this._codecParser.parseChunk(oggOpusData)];
  }

  _flush() {
    return [...this._codecParser.flush()];
  }

  async decode(oggOpusData) {
    const decoded = await this._decode(this._parse(oggOpusData));

    return WASMAudioDecoderCommon.getDecodedAudioMultiChannel(...decoded);
  }

  async decodeFile(oggOpusData) {
    const decoded = await this._decode([
      ...this._parse(oggOpusData),
      ...this._flush(),
    ]);
    this._init();

    return WASMAudioDecoderCommon.getDecodedAudioMultiChannel(...decoded);
  }

  async flush() {
    const decoded = await this._decode(this._flush());
    this._init();

    return WASMAudioDecoderCommon.getDecodedAudioMultiChannel(...decoded);
  }
}
