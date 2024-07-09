import { MetricInterface } from '../features/metrics';
export declare class RuntimeMetricsOptions {
    gcOldPause: boolean;
    gcNewPause: boolean;
    pageFaults: boolean;
    contextSwitchs: boolean;
}
export default class RuntimeMetrics implements MetricInterface {
    private metricService;
    private logger;
    private runtimeStatsService;
    private handle;
    private metrics;
    init(config?: RuntimeMetricsOptions | boolean): any;
    destroy(): void;
}
