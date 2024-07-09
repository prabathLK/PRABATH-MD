import { MetricInterface } from '../features/metrics';
export declare class HttpMetricsConfig {
    http: boolean;
}
export default class HttpMetrics implements MetricInterface {
    private defaultConf;
    private metrics;
    private logger;
    private metricService;
    private modules;
    private hooks;
    init(config?: HttpMetricsConfig | boolean): any;
    private registerHttpMetric;
    private registerHttpsMetric;
    destroy(): void;
    private hookHttp;
    private hookRequire;
}
