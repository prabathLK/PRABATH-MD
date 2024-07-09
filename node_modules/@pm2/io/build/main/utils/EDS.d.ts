export default class ExponentiallyDecayingSample {
    private RESCALE_INTERVAL;
    private ALPHA;
    private SIZE;
    private _elements;
    private _rescaleInterval;
    private _alpha;
    private _size;
    private _landmark;
    private _nextRescale;
    private _mean;
    constructor(options?: any);
    update(value: any, timestamp?: any): void;
    toSortedArray(): any;
    toArray(): any;
    _weight(age: any): number;
    _priority(age: any): number;
    _random(): number;
    _rescale(now: any): void;
    avg(now: any): number;
}
