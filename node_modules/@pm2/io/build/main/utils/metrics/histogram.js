"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const EDS_1 = require("../EDS");
class Histogram {
    constructor(opts) {
        this._sample = new EDS_1.default();
        this._count = 0;
        this._sum = 0;
        this._varianceM = 0;
        this._varianceS = 0;
        this._ema = 0;
        this.used = false;
        opts = opts || {};
        this._measurement = opts.measurement;
        this._callFn = null;
        const methods = {
            min: this.getMin,
            max: this.getMax,
            sum: this.getSum,
            count: this.getCount,
            variance: this._calculateVariance,
            mean: this._calculateMean,
            ema: this.getEma()
        };
        if (methods.hasOwnProperty(this._measurement)) {
            this._callFn = methods[this._measurement];
        }
        else {
            this._callFn = function () {
                const percentiles = this.percentiles([0.5, 0.75, 0.95, 0.99, 0.999]);
                const medians = {
                    median: percentiles[0.5],
                    p75: percentiles[0.75],
                    p95: percentiles[0.95],
                    p99: percentiles[0.99],
                    p999: percentiles[0.999]
                };
                return medians[this._measurement];
            };
        }
    }
    update(value) {
        this.used = true;
        this._count++;
        this._sum += value;
        this._sample.update(value);
        this._updateMin(value);
        this._updateMax(value);
        this._updateVariance(value);
        this._updateEma(value);
    }
    percentiles(percentiles) {
        const values = this._sample
            .toArray()
            .sort(function (a, b) {
            return (a === b)
                ? 0
                : a - b;
        });
        const results = {};
        for (let i = 0; i < percentiles.length; i++) {
            const percentile = percentiles[i];
            if (!values.length) {
                results[percentile] = null;
                continue;
            }
            const pos = percentile * (values.length + 1);
            if (pos < 1) {
                results[percentile] = values[0];
            }
            else if (pos >= values.length) {
                results[percentile] = values[values.length - 1];
            }
            else {
                const lower = values[Math.floor(pos) - 1];
                const upper = values[Math.ceil(pos) - 1];
                results[percentile] = lower + (pos - Math.floor(pos)) * (upper - lower);
            }
        }
        return results;
    }
    val() {
        if (typeof (this._callFn) === 'function') {
            return this._callFn();
        }
        else {
            return this._callFn;
        }
    }
    getMin() {
        return this._min;
    }
    getMax() {
        return this._max;
    }
    getSum() {
        return this._sum;
    }
    getCount() {
        return this._count;
    }
    getEma() {
        return this._ema;
    }
    fullResults() {
        const percentiles = this.percentiles([0.5, 0.75, 0.95, 0.99, 0.999]);
        return {
            min: this._min,
            max: this._max,
            sum: this._sum,
            variance: this._calculateVariance(),
            mean: this._calculateMean(),
            count: this._count,
            median: percentiles[0.5],
            p75: percentiles[0.75],
            p95: percentiles[0.95],
            p99: percentiles[0.99],
            p999: percentiles[0.999],
            ema: this._ema
        };
    }
    _updateMin(value) {
        if (this._min === undefined || value < this._min) {
            this._min = value;
        }
    }
    _updateMax(value) {
        if (this._max === undefined || value > this._max) {
            this._max = value;
        }
    }
    _updateVariance(value) {
        if (this._count === 1)
            return this._varianceM = value;
        const oldM = this._varianceM;
        this._varianceM += ((value - oldM) / this._count);
        this._varianceS += ((value - oldM) * (value - this._varianceM));
    }
    _updateEma(value) {
        if (this._count <= 1)
            return this._ema = this._calculateMean();
        const alpha = 2 / (1 + this._count);
        this._ema = value * alpha + this._ema * (1 - alpha);
    }
    _calculateMean() {
        return (this._count === 0)
            ? 0
            : this._sum / this._count;
    }
    _calculateVariance() {
        return (this._count <= 1)
            ? null
            : this._varianceS / (this._count - 1);
    }
    isUsed() {
        return this.used;
    }
}
exports.default = Histogram;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGlzdG9ncmFtLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL3V0aWxzL21ldHJpY3MvaGlzdG9ncmFtLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsZ0NBQXdCO0FBRXhCLE1BQXFCLFNBQVM7SUFrQjVCLFlBQWEsSUFBSztRQWRWLFlBQU8sR0FBRyxJQUFJLGFBQUcsRUFBRSxDQUFBO1FBR25CLFdBQU0sR0FBVyxDQUFDLENBQUE7UUFDbEIsU0FBSSxHQUFXLENBQUMsQ0FBQTtRQUloQixlQUFVLEdBQVcsQ0FBQyxDQUFBO1FBQ3RCLGVBQVUsR0FBVyxDQUFDLENBQUE7UUFDdEIsU0FBSSxHQUFXLENBQUMsQ0FBQTtRQUVoQixTQUFJLEdBQVksS0FBSyxDQUFBO1FBRzNCLElBQUksR0FBRyxJQUFJLElBQUksRUFBRSxDQUFBO1FBRWpCLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQTtRQUNwQyxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQTtRQUVuQixNQUFNLE9BQU8sR0FBRztZQUNkLEdBQUcsRUFBUSxJQUFJLENBQUMsTUFBTTtZQUN0QixHQUFHLEVBQVEsSUFBSSxDQUFDLE1BQU07WUFDdEIsR0FBRyxFQUFRLElBQUksQ0FBQyxNQUFNO1lBQ3RCLEtBQUssRUFBTSxJQUFJLENBQUMsUUFBUTtZQUN4QixRQUFRLEVBQUcsSUFBSSxDQUFDLGtCQUFrQjtZQUNsQyxJQUFJLEVBQU8sSUFBSSxDQUFDLGNBQWM7WUFFOUIsR0FBRyxFQUFRLElBQUksQ0FBQyxNQUFNLEVBQUU7U0FDekIsQ0FBQTtRQUVELElBQUksT0FBTyxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLEVBQUUsQ0FBQztZQUM5QyxJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUE7UUFDM0MsQ0FBQzthQUFNLENBQUM7WUFDTixJQUFJLENBQUMs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