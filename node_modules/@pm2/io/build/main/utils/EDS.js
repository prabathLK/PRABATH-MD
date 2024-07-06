"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BinaryHeap_1 = require("./BinaryHeap");
const units_1 = require("./units");
class ExponentiallyDecayingSample {
    constructor(options) {
        this.RESCALE_INTERVAL = 1 * units_1.default.HOURS;
        this.ALPHA = 0.015;
        this.SIZE = 1028;
        options = options || {};
        this._elements = new BinaryHeap_1.default({
            score: function (element) {
                return -element.priority;
            }
        });
        this._rescaleInterval = options.rescaleInterval || this.RESCALE_INTERVAL;
        this._alpha = options.alpha || this.ALPHA;
        this._size = options.size || this.SIZE;
        this._random = options.random || this._random;
        this._landmark = null;
        this._nextRescale = null;
        this._mean = null;
    }
    update(value, timestamp) {
        const now = Date.now();
        if (!this._landmark) {
            this._landmark = now;
            this._nextRescale = this._landmark + this._rescaleInterval;
        }
        timestamp = timestamp || now;
        const newSize = this._elements.size() + 1;
        const element = {
            priority: this._priority(timestamp - this._landmark),
            value: value
        };
        if (newSize <= this._size) {
            this._elements.add(element);
        }
        else if (element.priority > this._elements.first().priority) {
            this._elements.removeFirst();
            this._elements.add(element);
        }
        if (now >= this._nextRescale)
            this._rescale(now);
    }
    toSortedArray() {
        return this._elements
            .toSortedArray()
            .map(function (element) {
            return element.value;
        });
    }
    toArray() {
        return this._elements
            .toArray()
            .map(function (element) {
            return element.value;
        });
    }
    _weight(age) {
        return Math.exp(this._alpha * (age / 1000));
    }
    _priority(age) {
        return this._weight(age) / this._random();
    }
    _random() {
        return Math.random();
    }
    _rescale(now) {
        now = now || Date.now();
        const self = this;
        const oldLandmark = this._landmark;
        this._landmark = now || Date.now();
        this._nextRescale = now + this._rescaleInterval;
        const factor = self._priority(-(self._landmark - oldLandmark));
        this._elements
            .toArray()
            .forEach(function (element) {
            element.priority *= factor;
        });
    }
    avg(now) {
        let sum = 0;
        this._elements
            .toArray()
            .forEach(function (element) {
            sum += element.value;
        });
        return (sum / this._elements.size());
    }
}
exports.default = ExponentiallyDecayingSample;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRURTLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3V0aWxzL0VEUy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDZDQUFxQztBQUNyQyxtQ0FBMkI7QUFFM0IsTUFBcUIsMkJBQTJCO0lBYTlDLFlBQWEsT0FBUTtRQVpiLHFCQUFnQixHQUFHLENBQUMsR0FBRyxlQUFLLENBQUMsS0FBSyxDQUFBO1FBQ2xDLFVBQUssR0FBRyxLQUFLLENBQUE7UUFDYixTQUFJLEdBQUcsSUFBSSxDQUFBO1FBV2pCLE9BQU8sR0FBRyxPQUFPLElBQUksRUFBRSxDQUFBO1FBRXZCLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxvQkFBVSxDQUFDO1lBQzlCLEtBQUssRUFBRSxVQUFVLE9BQU87Z0JBQ3RCLE9BQU8sQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFBO1lBQzFCLENBQUM7U0FDRixDQUFDLENBQUE7UUFFRixJQUFJLENBQUMsZ0JBQWdCLEdBQUcsT0FBTyxDQUFDLGVBQWUsSUFBSSxJQUFJLENBQUMsZ0JBQWdCLENBQUE7UUFDeEUsSUFBSSxDQUFDLE1BQU0sR0FBRyxPQUFPLENBQUMsS0FBSyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUE7UUFDekMsSUFBSSxDQUFDLEtBQUssR0FBRyxPQUFPLENBQUMsSUFBSSxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUE7UUFDdEMsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUE7UUFDN0MsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUE7UUFDckIsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUE7UUFDeEIsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUE7SUFDbkIsQ0FBQztJQUVELE1BQU0sQ0FBRSxLQUFLLEVBQUUsU0FBVTtRQUN2QixNQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUE7UUFD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