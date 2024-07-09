import { DecodeError } from "@wasm-audio-decoders/common";

export interface OpusDecodedAudio {
  channelData: Float32Array[];
  samplesDecoded: number;
  sampleRate: 48000;
  errors: DecodeError[];
}

export class OpusDecoder {
  constructor(options?: {
    forceStereo?: boolean;
    preSkip?: number;
    channels?: number;
    streamCount?: number;
    coupledStreamCount?: number;
    channelMappingTable?: number[];
  });
  ready: Promise<void>;
  reset: () => Promise<void>;
  free: () => void;
  decodeFrame: (opusFrame: Uint8Array) => OpusDecodedAudio;
  decodeFrames: (opusFrames: Uint8Array[]) => OpusDecodedAudio;
}

export class OpusDecoderWebWorker {
  constructor(options?: {
    forceStereo?: boolean;
    preSkip?: number;
    channels?: number;
    streamCount?: number;
    coupledStreamCount?: number;
    channelMappingTable?: number[];
  });
  ready: Promise<void>;
  reset: () => Promise<void>;
  free: () => Promise<void>;
  decodeFrame: (opusFrame: Uint8Array) => Promise<OpusDecodedAudio>;
  decodeFrames: (opusFrames: Uint8Array[]) => Promise<OpusDecodedAudio>;
}

export { DecodeError };
