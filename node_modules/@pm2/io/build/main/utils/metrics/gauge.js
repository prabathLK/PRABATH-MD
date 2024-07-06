"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Gauge {
    constructor() {
        this.value = 0;
        this.used = false;
    }
    val() {
        return this.value;
    }
    set(value) {
        this.used = true;
        this.value = value;
    }
    isUsed() {
        return this.used;
    }
}
exports.default = Gauge;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2F1Z2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvdXRpbHMvbWV0cmljcy9nYXVnZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLE1BQXFCLEtBQUs7SUFBMUI7UUFDVSxVQUFLLEdBQUcsQ0FBQyxDQUFBO1FBQ1QsU0FBSSxHQUFHLEtBQUssQ0FBQTtJQWN0QixDQUFDO0lBWkMsR0FBRztRQUNELE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQTtJQUNuQixDQUFDO0lBRUQsR0FBRyxDQUFFLEtBQUs7UUFDUixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQTtRQUNoQixJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQTtJQUNwQixDQUFDO0lBRUQsTUFBTTtRQUNKLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQTtJQUNsQixDQUFDO0NBQ0Y7QUFoQkQsd0JBZ0JDIn0=