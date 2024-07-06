import { EventEmitter2 } from 'eventemitter2';
import EWMA from './EWMA';
import Histogram from './metrics/histogram';
export interface Span {
    name: string;
    labels: any;
    kind: string;
    startTime: number;
    min: number;
    max: number;
    median: number;
}
export interface Variance {
    spans: Span[];
    count: number;
    min: number;
    max: number;
    median: number;
    p95: number;
}
export interface Route {
    path: string;
    meta: {
        min: number;
        max: number;
        count: number;
        meter: number;
        median: number;
        p95: number;
    };
    variances: Variance[];
}
export interface Trace {
    routes: Route[];
    meta: {
        trace_count: number;
        http_meter: number;
        db_meter: number;
        http_percentiles: {
            median: number;
            p95: number;
            p99: number;
        };
        db_percentiles: any;
    };
}
export interface TraceCache {
    routes: any;
    meta: {
        trace_count: number;
        http_meter: EWMA;
        db_meter: EWMA;
        histogram: Histogram;
        db_histograms: any;
    };
}
export declare class TransactionAggregator extends EventEmitter2 {
    private spanTypes;
    private cache;
    private privacyRegex;
    private worker;
    init(sendInterval?: number): void;
    destroy(): void;
    getAggregation(): TraceCache;
    validateData(packet: any): boolean;
    aggregate(packet: any): false | TraceCache;
    mergeTrace(aggregated: any, trace: any): void;
    updateSpanDuration(spans: any, newSpans: any): void;
    compareList(one: any[], two: any[]): boolean;
    matchPath(path: any, routes: any): any;
    prepareAggregationforShipping(): Trace;
    isIdentifier(id: any): boolean;
    censorSpans(spans: any): any;
}
