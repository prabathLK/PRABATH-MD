export default class BinaryHeap {
    private _elements;
    constructor(options: any);
    add(): void;
    first(): any;
    removeFirst(): any;
    clone(): BinaryHeap;
    toSortedArray(): any[];
    toArray(): never[];
    size(): any;
    _bubble(bubbleIndex: any): void;
    _sink(sinkIndex: any): void;
    _parentIndex(index: any): number;
    _childIndexes(index: any): number[];
    _score(element: any): any;
}
