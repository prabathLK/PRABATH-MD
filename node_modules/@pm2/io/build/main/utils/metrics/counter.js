"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Counter {
    constructor(opts) {
        this.used = false;
        opts = opts || {};
        this._count = opts.count || 0;
    }
    val() {
        return this._count;
    }
    inc(n) {
        this.used = true;
        this._count += (n || 1);
    }
    dec(n) {
        this.used = true;
        this._count -= (n || 1);
    }
    reset(count) {
        this._count = count || 0;
    }
    isUsed() {
        return this.used;
    }
}
exports.default = Counter;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY291bnRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy91dGlscy9tZXRyaWNzL2NvdW50ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxNQUFxQixPQUFPO0lBSTFCLFlBQWEsSUFBSztRQUZWLFNBQUksR0FBWSxLQUFLLENBQUE7UUFHM0IsSUFBSSxHQUFHLElBQUksSUFBSSxFQUFFLENBQUE7UUFDakIsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsS0FBSyxJQUFJLENBQUMsQ0FBQTtJQUMvQixDQUFDO0lBRUQsR0FBRztRQUNELE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQTtJQUNwQixDQUFDO0lBRUQsR0FBRyxDQUFFLENBQVU7UUFDYixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQTtRQUNoQixJQUFJLENBQUMsTUFBTSxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFBO0lBQ3pCLENBQUM7SUFFRCxHQUFHLENBQUUsQ0FBVTtRQUNiLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFBO1FBQ2hCLElBQUksQ0FBQyxNQUFNLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUE7SUFDekIsQ0FBQztJQUVELEtBQUssQ0FBRSxLQUFjO1FBQ25CLElBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxJQUFJLENBQUMsQ0FBQTtJQUMxQixDQUFDO0lBRUQsTUFBTTtRQUNKLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQTtJQUNsQixDQUFDO0NBQ0Y7QUE5QkQsMEJBOEJDIn0=