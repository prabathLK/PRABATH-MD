export default class ExponentiallyWeightedMovingAverage {
    private _timePeriod;
    private _tickInterval;
    private _alpha;
    private _count;
    private _rate;
    private TICK_INTERVAL;
    constructor(timePeriod?: number, tickInterval?: number);
    update(n: any): void;
    tick(): void;
    rate(timeUnit: any): number;
}
