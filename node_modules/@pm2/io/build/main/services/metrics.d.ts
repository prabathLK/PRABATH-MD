import Meter from '../utils/metrics/meter';
import Counter from '../utils/metrics/counter';
import Histogram from '../utils/metrics/histogram';
import { Service } from '../serviceManager';
import Gauge from '../utils/metrics/gauge';
export declare enum MetricType {
    'meter' = "meter",
    'histogram' = "histogram",
    'counter' = "counter",
    'gauge' = "gauge",
    'metric' = "metric"
}
export declare enum MetricMeasurements {
    'min' = "min",
    'max' = "max",
    'sum' = "sum",
    'count' = "count",
    'variance' = "variance",
    'mean' = "mean",
    'stddev' = "stddev",
    'median' = "median",
    'p75' = "p75",
    'p95' = "p95",
    'p99' = "p99",
    'p999' = "p999"
}
export interface InternalMetric {
    name?: string;
    type?: MetricType;
    id?: string;
    historic?: boolean;
    unit?: string;
    handler: Function;
    implementation: any;
    value?: number;
}
export declare class Metric {
    name?: string;
    id?: string;
    historic?: boolean;
    unit?: string;
    value?: () => number;
}
export declare class MetricBulk extends Metric {
    type: MetricType;
}
export declare class HistogramOptions extends Metric {
    measurement: MetricMeasurements;
}
export declare class MetricService implements Service {
    private metrics;
    private timer;
    private transport;
    private logger;
    init(): void;
    registerMetric(metric: InternalMetric): void;
    meter(opts: Metric): Meter;
    counter(opts: Metric): Counter;
    histogram(opts: HistogramOptions): Histogram;
    metric(opts: Metric): Gauge;
    deleteMetric(name: string): boolean;
    destroy(): void;
}
