"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const units_1 = require("./units");
class ExponentiallyWeightedMovingAverage {
    constructor(timePeriod, tickInterval) {
        this._count = 0;
        this._rate = 0;
        this.TICK_INTERVAL = 5 * units_1.default.SECONDS;
        this._timePeriod = timePeriod || 1 * units_1.default.MINUTES;
        this._tickInterval = tickInterval || this.TICK_INTERVAL;
        this._alpha = 1 - Math.exp(-this._tickInterval / this._timePeriod);
    }
    update(n) {
        this._count += n;
    }
    tick() {
        const instantRate = this._count / this._tickInterval;
        this._count = 0;
        this._rate += (this._alpha * (instantRate - this._rate));
    }
    rate(timeUnit) {
        return (this._rate || 0) * timeUnit;
    }
}
exports.default = ExponentiallyWeightedMovingAverage;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRVdNQS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy91dGlscy9FV01BLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsbUNBQTJCO0FBRTNCLE1BQXFCLGtDQUFrQztJQVNyRCxZQUFhLFVBQW1CLEVBQUUsWUFBcUI7UUFML0MsV0FBTSxHQUFXLENBQUMsQ0FBQTtRQUNsQixVQUFLLEdBQVcsQ0FBQyxDQUFBO1FBRWpCLGtCQUFhLEdBQVcsQ0FBQyxHQUFHLGVBQUssQ0FBQyxPQUFPLENBQUE7UUFHL0MsSUFBSSxDQUFDLFdBQVcsR0FBRyxVQUFVLElBQUksQ0FBQyxHQUFHLGVBQUssQ0FBQyxPQUFPLENBQUE7UUFDbEQsSUFBSSxDQUFDLGFBQWEsR0FBRyxZQUFZLElBQUksSUFBSSxDQUFDLGFBQWEsQ0FBQTtRQUN2RCxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUE7SUFDcEUsQ0FBQztJQUVELE1BQU0sQ0FBRSxDQUFDO1FBQ1AsSUFBSSxDQUFDLE1BQU0sSUFBSSxDQUFDLENBQUE7SUFDbEIsQ0FBQztJQUVELElBQUk7UUFDRixNQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUE7UUFDcEQsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUE7UUFFZixJQUFJLENBQUMsS0FBSyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQTtJQUMxRCxDQUFDO0lBRUQsSUFBSSxDQUFFLFFBQVE7UUFDWixPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssSUFBSSxDQUFDLENBQUMsR0FBRyxRQUFRLENBQUE7SUFDckMsQ0FBQztDQUNGO0FBN0JELHFEQTZCQyJ9