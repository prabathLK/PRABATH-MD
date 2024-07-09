"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class BinaryHeap {
    constructor(options) {
        options = options || {};
        this._elements = options.elements || [];
        this._score = options.score || this._score;
    }
    add() {
        for (let i = 0; i < arguments.length; i++) {
            const element = arguments[i];
            this._elements.push(element);
            this._bubble(this._elements.length - 1);
        }
    }
    first() {
        return this._elements[0];
    }
    removeFirst() {
        const root = this._elements[0];
        const last = this._elements.pop();
        if (this._elements.length > 0) {
            this._elements[0] = last;
            this._sink(0);
        }
        return root;
    }
    clone() {
        return new BinaryHeap({
            elements: this.toArray(),
            score: this._score
        });
    }
    toSortedArray() {
        const array = [];
        const clone = this.clone();
        while (true) {
            const element = clone.removeFirst();
            if (element === undefined)
                break;
            array.push(element);
        }
        return array;
    }
    toArray() {
        return [].concat(this._elements);
    }
    size() {
        return this._elements.length;
    }
    _bubble(bubbleIndex) {
        const bubbleElement = this._elements[bubbleIndex];
        const bubbleScore = this._score(bubbleElement);
        while (bubbleIndex > 0) {
            const parentIndex = this._parentIndex(bubbleIndex);
            const parentElement = this._elements[parentIndex];
            const parentScore = this._score(parentElement);
            if (bubbleScore <= parentScore)
                break;
            this._elements[parentIndex] = bubbleElement;
            this._elements[bubbleIndex] = parentElement;
            bubbleIndex = parentIndex;
        }
    }
    _sink(sinkIndex) {
        const sinkElement = this._elements[sinkIndex];
        const sinkScore = this._score(sinkElement);
        const length = this._elements.length;
        while (true) {
            let swapIndex;
            let swapScore;
            let swapElement = null;
            const childIndexes = this._childIndexes(sinkIndex);
            for (let i = 0; i < childIndexes.length; i++) {
                const childIndex = childIndexes[i];
                if (childIndex >= length)
                    break;
                const childElement = this._elements[childIndex];
                const childScore = this._score(childElement);
                if (childScore > sinkScore) {
                    if (swapScore === undefined || swapScore < childScore) {
                        swapIndex = childIndex;
                        swapScore = childScore;
                        swapElement = childElement;
                    }
                }
            }
            if (swapIndex === undefined)
                break;
            this._elements[swapIndex] = sinkElement;
            this._elements[sinkIndex] = swapElement;
            sinkIndex = swapIndex;
        }
    }
    _parentIndex(index) {
        return Math.floor((index - 1) / 2);
    }
    _childIndexes(index) {
        return [
            2 * index + 1,
            2 * index + 2
        ];
    }
    _score(element) {
        return element.valueOf();
    }
}
exports.default = BinaryHeap;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQmluYXJ5SGVhcC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy91dGlscy9CaW5hcnlIZWFwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsTUFBcUIsVUFBVTtJQUk3QixZQUFhLE9BQU87UUFDbEIsT0FBTyxHQUFHLE9BQU8sSUFBSSxFQUFFLENBQUE7UUFFdkIsSUFBSSxDQUFDLFNBQVMsR0FBRyxPQUFPLENBQUMsUUFBUSxJQUFJLEVBQUUsQ0FBQTtRQUN2QyxJQUFJLENBQUMsTUFBTSxHQUFHLE9BQU8sQ0FBQyxLQUFLLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQTtJQUM1QyxDQUFDO0lBRUQsR0FBRztRQUNELEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxTQUFTLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7WUFDMUMsTUFBTSxPQUFPLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFBO1lBRTVCLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFBO1lBQzVCLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUE7UUFDekMsQ0FBQztJQUNILENBQUM7SUFFRCxLQUFLO1FBQ0gsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFBO0lBQzFCLENBQUM7SUFFRCxXQUFXO1FBQ1QsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtRQUM5QixNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRSxDQUFBO1FBRWpDLElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFLENBQUM7WUFDOUIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUE7WUFDeEIsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQTtRQUNmLENBQUM7UUFFRCxPQUFPLElBQUksQ0FBQTtJQUNiLENBQUM7SUFFRCxLQUFLO1FBQ0gsT0FBTyxJQUFJLFVBQVUsQ0FBQztZQUNwQixRQUFRLEVBQUUsSUFBSSxDQUFDLE9BQU8sRUFBRTtZQUN4QixLQUFLLEVBQUUsSUFBSSxDQUFDLE1BQU07U0FDbkIsQ0FBQyxDQUFBO0lBQ0osQ0FBQztJQUVELGFBQWE7UUFDWCxNQUFNLEtBQUssR0FBVSxFQUFFLENBQUE7UUFDdkIsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFBO1FBRTFCLE9BQU8sSUFBSSxFQUFFLENBQUM7WUFDWixNQUFNLE9BQU8sR0FBRyxLQUFLLENBQUMsV0FBVyxFQUFFLENBQUE7WUFDbkMsSUFBSSxPQUFPLEtBQUssU0FBUztnQkFBRSxNQUFLO1lBRWhDLEtBQUssQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUE7UUFDckIsQ0FBQztRQUVELE9BQU8sS0FBSyxDQUFBO0lBQ2QsQ0FBQztJQUVELE9BQU87UUFDTCxPQUFPLEVBQUUsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFBO0lBQ2xDLENBQUM7SUFFRCxJQUFJO1FBQ0YsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQTtJQUM5QixDQUFDO0lBRUQsT0FBTyxDQUFFLFdBQVc7UUFDbEIsTUFBTSxhQUFhLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUMsQ0FBQTtRQUNqRCxNQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxDQUFBO1FBRTlDLE9BQU8sV0FBVyxHQUFHLENBQUMsRUFBRSxDQUFDO1lBQ3ZCLE1BQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsV0FBVyxDQUFDLENBQUE7WUFDbEQsTUFBTSxhQUFhLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUMsQ0FBQTtZQUNqRCxNQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxDQUFBO1lBRTlDLElBQUksV0FBVyxJQUFJLFdBQVc7Z0JBQUUsTUFBSztZQUVyQyxJQUFJLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxHQUFHLGFBQWEsQ0FBQTtZQUMzQyxJQUFJLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxHQUFHLGFBQWEsQ0FBQTtZQUMzQyxXQUFXLEdBQUcsV0FBVyxDQUFBO1FBQzNCLENBQUM7SUFDSCxDQUFDO0lBRUQsS0FBSyxDQUFFLFNBQVM7UUFDZCxNQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxDQUFBO1FBQzdDLE1BQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUE7UUFDMUMsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUE7UUFFcEMsT0FBTyxJQUFJLEVBQUUsQ0FBQztZQUNaLElBQUksU0FBUyxDQUFBO1lBQ2IsSUFBSSxTQUFTLENBQUE7WUFDYixJQUFJLFdBQVcsR0FBRyxJQUFJLENBQUE7WUFDdEIsTUFBTSxZQUFZLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxTQUFTLENBQUMsQ0FBQTtZQUVsRCxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsWUFBWSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO2dCQUM3QyxNQUFNLFVBQVUsR0FBRyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUE7Z0JBRWxDLElBQUksVUFBVSxJQUFJLE1BQU07b0JBQUUsTUFBSztnQkFFL0IsTUFBTSxZQUFZLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsQ0FBQTtnQkFDL0MsTUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQTtnQkFFNUMsSUFBSSxVQUFVLEdBQUcsU0FBUyxFQUFFLENBQUM7b0JBQzNCLElBQUksU0FBUyxLQUFLLFNBQVMsSUFBSSxTQUFTLEdBQUcsVUFBVSxFQUFFLENBQUM7d0JBQ3RELFNBQVMsR0FBRyxVQUFVLENBQUE7d0JBQ3RCLFNBQVMsR0FBRyxVQUFVLENBQUE7d0JBQ3RCLFdBQVcsR0FBRyxZQUFZLENBQUE7b0JBQzVCLENBQUM7Z0JBQ0gsQ0FBQztZQUNILENBQUM7WUFFRCxJQUFJLFNBQVMsS0FBSyxTQUFTO2dCQUFFLE1BQUs7WUFFbEMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsR0FBRyxXQUFXLENBQUE7WUFDdkMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsR0FBRyxXQUFXLENBQUE7WUFDdkMsU0FBUyxHQUFHLFNBQVMsQ0FBQTtRQUN2QixDQUFDO0lBQ0gsQ0FBQztJQUVELFlBQVksQ0FBRSxLQUFLO1FBQ2pCLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQTtJQUNwQyxDQUFDO0lBRUQsYUFBYSxDQUFFLEtBQUs7UUFDbEIsT0FBTztZQUNMLENBQUMsR0FBRyxLQUFLLEdBQUcsQ0FBQztZQUNiLENBQUMsR0FBRyxLQUFLLEdBQUcsQ0FBQztTQUNkLENBQUE7SUFDSCxDQUFDO0lBRUQsTUFBTSxDQUFFLE9BQU87UUFDYixPQUFPLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQTtJQUMxQixDQUFDO0NBQ0Y7QUFwSUQsNkJBb0lDIn0=