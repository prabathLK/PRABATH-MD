import { OpusDecoderWebWorker } from "opus-decoder";
import OggOpusDecoder from "./OggOpusDecoder.js";

export default class OggOpusDecoderWebWorker extends OggOpusDecoder {
  constructor(options) {
    super(options);

    this._decoderClass = OpusDecoderWebWorker;
  }

  async free() {
    super.free();
  }
}
