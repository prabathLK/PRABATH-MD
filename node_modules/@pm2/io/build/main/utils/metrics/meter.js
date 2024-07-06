"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const EWMA_1 = require("../EWMA");
const units_1 = require("../units");
class Meter {
    constructor(opts) {
        this.used = false;
        this.mark = function (n = 1) {
            this.used = true;
            this._rate.update(n);
        };
        this.val = function () {
            return Math.round(this._rate.rate(this._samples * units_1.default.SECONDS) * 100) / 100;
        };
        const self = this;
        if (typeof opts !== 'object') {
            opts = {};
        }
        this._samples = opts.samples || opts.seconds || 1;
        this._timeframe = opts.timeframe || 60;
        this._tickInterval = opts.tickInterval || 5 * units_1.default.SECONDS;
        this._rate = new EWMA_1.default(this._timeframe * units_1.default.SECONDS, this._tickInterval);
        if (opts.debug && opts.debug === true) {
            return;
        }
        this._interval = setInterval(function () {
            self._rate.tick();
        }, this._tickInterval);
        this._interval.unref();
    }
    isUsed() {
        return this.used;
    }
}
exports.default = Meter;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWV0ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvdXRpbHMvbWV0cmljcy9tZXRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLGtDQUEwQjtBQUMxQixvQ0FBNEI7QUFFNUIsTUFBcUIsS0FBSztJQVN4QixZQUFhLElBQVU7UUFGZixTQUFJLEdBQVksS0FBSyxDQUFBO1FBMEI3QixTQUFJLEdBQUcsVUFBVSxJQUFZLENBQUM7WUFDNUIsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUE7WUFDaEIsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUE7UUFDdEIsQ0FBQyxDQUFBO1FBRUQsUUFBRyxHQUFHO1lBQ0osT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLEdBQUcsZUFBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQTtRQUMvRSxDQUFDLENBQUE7UUE5QkMsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFBO1FBRWpCLElBQUksT0FBTyxJQUFJLEtBQUssUUFBUSxFQUFFLENBQUM7WUFDN0IsSUFBSSxHQUFHLEVBQUUsQ0FBQTtRQUNYLENBQUM7UUFFRCxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxPQUFPLElBQUksSUFBSSxDQUFDLE9BQU8sSUFBSSxDQUFDLENBQUE7UUFDakQsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsU0FBUyxJQUFJLEVBQUUsQ0FBQTtRQUN0QyxJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQyxZQUFZLElBQUksQ0FBQyxHQUFHLGVBQUssQ0FBQyxPQUFPLENBQUE7UUFFM0QsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLGNBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxHQUFHLGVBQUssQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFBO1FBRTFFLElBQUksSUFBSSxDQUFDLEtBQUssSUFBSSxJQUFJLENBQUMsS0FBSyxLQUFLLElBQUksRUFBRSxDQUFDO1lBQ3RDLE9BQU07UUFDUixDQUFDO1FBRUQsSUFBSSxDQUFDLFNBQVMsR0FBRyxXQUFXLENBQUM7WUFDM0IsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQTtRQUNuQixDQUFDLEVBQUUsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFBO1FBRXRCLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLENBQUE7SUFDeEIsQ0FBQztJQVdELE1BQU07UUFDSixPQUFPLElBQUksQ0FBQyxJQUFJLENBQUE7SUFDbEIsQ0FBQztDQUNGO0FBN0NELHdCQTZDQyJ9