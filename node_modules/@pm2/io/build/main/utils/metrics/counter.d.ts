export default class Counter {
    private _count;
    private used;
    constructor(opts?: any);
    val(): number;
    inc(n?: number): void;
    dec(n?: number): void;
    reset(count?: number): void;
    isUsed(): boolean;
}
