import { MetricInterface } from '../features/metrics';
export declare class EventLoopMetricOption {
    eventLoopActive: boolean;
    eventLoopDelay: boolean;
}
export default class EventLoopHandlesRequestsMetric implements MetricInterface {
    private metricService;
    private logger;
    private requestTimer;
    private handleTimer;
    private delayTimer;
    private delayLoopInterval;
    private runtimeStatsService;
    private handle;
    init(config?: EventLoopMetricOption | boolean): any;
    destroy(): void;
}
