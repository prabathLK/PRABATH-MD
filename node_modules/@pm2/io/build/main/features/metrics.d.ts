import { Feature } from '../featureManager';
import { EventLoopMetricOption } from '../metrics/eventLoopMetrics';
import { NetworkTrafficConfig } from '../metrics/network';
import { HttpMetricsConfig } from '../metrics/httpMetrics';
import { V8MetricsConfig } from '../metrics/v8';
import { RuntimeMetricsOptions } from '../metrics/runtime';
export declare const defaultMetricConf: MetricConfig;
export declare class MetricConfig {
    v8?: V8MetricsConfig | boolean;
    runtime?: RuntimeMetricsOptions | boolean;
    http?: HttpMetricsConfig | boolean;
    network?: NetworkTrafficConfig | boolean;
    eventLoop?: EventLoopMetricOption | boolean;
}
export interface MetricInterface {
    init(config?: Object | boolean): void;
    destroy(): void;
}
export declare class MetricsFeature implements Feature {
    private logger;
    init(options?: Object): void;
    get(name: string): MetricInterface | undefined;
    destroy(): void;
}
