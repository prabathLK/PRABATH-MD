export declare class BitInputStream {
    buffer: Uint8Array;
    protected start: number;
    protected limit: number;
    protected pos: number;
    protected bitPos: number;
    protected bit: number;
    constructor(buffer: Uint8Array, offset?: number, limit?: number);
    [Symbol.iterator](): Generator<number, void, unknown>;
    get length(): number;
    get position(): number;
    seek(pos: number): BitInputStream;
    read(wordSize?: number): number;
    readFields(fields: number[]): number[];
    readWords(n: number, wordSize?: number): number[];
    readStruct(fields: [string, number][]): any;
    readBit(): number;
    protected _read(wordSize: number): number;
    protected checkLimit(requested: number): void;
}
//# sourceMappingURL=input.d.ts.map