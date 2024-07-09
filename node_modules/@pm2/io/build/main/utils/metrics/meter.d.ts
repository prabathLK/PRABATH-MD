export default class Meter {
    private _tickInterval;
    private _samples;
    private _timeframe;
    private _rate;
    private _interval;
    private used;
    constructor(opts?: any);
    mark: (n?: number) => void;
    val: () => number;
    isUsed(): boolean;
}
