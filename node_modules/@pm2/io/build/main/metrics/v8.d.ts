import { MetricInterface } from '../features/metrics';
export declare class V8MetricsConfig {
    new_space: boolean;
    old_space: boolean;
    map_space: boolean;
    code_space: boolean;
    large_object_space: boolean;
    heap_total_size: boolean;
    heap_used_size: boolean;
    heap_used_percent: boolean;
}
export default class V8Metric implements MetricInterface {
    private timer;
    private TIME_INTERVAL;
    private metricService;
    private logger;
    private metricStore;
    private unitKB;
    private metricsDefinitions;
    init(config?: V8MetricsConfig | boolean): any;
    destroy(): void;
    private formatMiBytes;
}
