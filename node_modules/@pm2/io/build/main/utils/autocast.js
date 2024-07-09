"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Autocast {
    constructor() {
        this.commonStrings = {
            'true': true,
            'false': false,
            'undefined': undefined,
            'null': null,
            'NaN': NaN
        };
    }
    process(key, value, o) {
        if (typeof (value) === 'object')
            return;
        o[key] = this._cast(value);
    }
    traverse(o, func) {
        for (let i in o) {
            func.apply(this, [i, o[i], o]);
            if (o[i] !== null && typeof (o[i]) === 'object') {
                this.traverse(o[i], func);
            }
        }
    }
    autocast(s) {
        if (typeof (s) === 'object') {
            this.traverse(s, this.process);
            return s;
        }
        return this._cast(s);
    }
    _cast(s) {
        let key;
        if (s instanceof Date)
            return s;
        if (typeof s === 'boolean')
            return s;
        if (!isNaN(s))
            return Number(s);
        for (key in this.commonStrings) {
            if (s === key)
                return this.commonStrings[key];
        }
        return s;
    }
}
exports.default = Autocast;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0b2Nhc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvdXRpbHMvYXV0b2Nhc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxNQUFxQixRQUFRO0lBQTdCO1FBSUUsa0JBQWEsR0FBRztZQUNkLE1BQU0sRUFBRSxJQUFJO1lBQ1osT0FBTyxFQUFFLEtBQUs7WUFDZCxXQUFXLEVBQUUsU0FBUztZQUN0QixNQUFNLEVBQUUsSUFBSTtZQUNaLEtBQUssRUFBRSxHQUFHO1NBQ1gsQ0FBQTtJQStDSCxDQUFDO0lBN0NDLE9BQU8sQ0FBRSxHQUFHLEVBQUMsS0FBSyxFQUFFLENBQUM7UUFDbkIsSUFBSSxPQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssUUFBUTtZQUFFLE9BQU07UUFDdEMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUE7SUFDNUIsQ0FBQztJQUVELFFBQVEsQ0FBRSxDQUFDLEVBQUMsSUFBSTtRQUNkLEtBQUssSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUM7WUFDaEIsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUE7WUFDNUIsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssSUFBSSxJQUFJLE9BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxRQUFRLEVBQUUsQ0FBQztnQkFFL0MsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsSUFBSSxDQUFDLENBQUE7WUFDMUIsQ0FBQztRQUNILENBQUM7SUFDSCxDQUFDO0lBS0QsUUFBUSxDQUFFLENBQUM7UUFDVCxJQUFJLE9BQU0sQ0FBQyxDQUFDLENBQUMsS0FBSyxRQUFRLEVBQUUsQ0FBQztZQUMzQixJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUE7WUFDOUIsT0FBTyxDQUFDLENBQUE7UUFDVixDQUFDO1FBRUQsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFBO0lBQ3RCLENBQUM7SUFFTyxLQUFLLENBQUUsQ0FBQztRQUNkLElBQUksR0FBRyxDQUFBO1FBR1AsSUFBSSxDQUFDLFlBQVksSUFBSTtZQUFFLE9BQU8sQ0FBQyxDQUFBO1FBQy9CLElBQUksT0FBTyxDQUFDLEtBQUssU0FBUztZQUFFLE9BQU8sQ0FBQyxDQUFBO1FBR3BDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1lBQUUsT0FBTyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUE7UUFHL0IsS0FBSyxHQUFHLElBQUksSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO1lBQy9CLElBQUksQ0FBQyxLQUFLLEdBQUc7Z0JBQUUsT0FBTyxJQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxDQUFBO1FBQy9DLENBQUM7UUFHRCxPQUFPLENBQUMsQ0FBQTtJQUNWLENBQUM7Q0FDRjtBQXpERCwyQkF5REMifQ==