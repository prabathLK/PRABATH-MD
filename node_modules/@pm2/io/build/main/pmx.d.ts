import { TransportConfig } from './services/transport';
import { ErrorContext } from './features/notify';
import { Metric, HistogramOptions, MetricBulk } from './services/metrics';
import Meter from './utils/metrics/meter';
import Histogram from './utils/metrics/histogram';
import Gauge from './utils/metrics/gauge';
import Counter from './utils/metrics/counter';
import { MetricConfig } from './features/metrics';
import { ProfilingConfig } from './features/profiling';
import { Entrypoint } from './features/entrypoint';
export declare class IOConfig {
    catchExceptions?: boolean;
    metrics?: MetricConfig;
    actions?: {
        eventLoopDump?: boolean;
    };
    profiling?: ProfilingConfig | boolean;
    standalone?: boolean;
    apmOptions?: TransportConfig;
}
export declare const defaultConfig: IOConfig;
export default class PMX {
    private initialConfig;
    private featureManager;
    private transport;
    private actionService;
    private metricService;
    private runtimeStatsService;
    private logger;
    private initialized;
    Entrypoint: {
        new (): Entrypoint;
    };
    init(config?: IOConfig): this;
    destroy(): void;
    getConfig(): IOConfig;
    notifyError(error: Error | string | {}, context?: ErrorContext): any;
    metrics(metric: MetricBulk | Array<MetricBulk>): any[];
    histogram(config: HistogramOptions): Histogram;
    metric(config: Metric): Gauge;
    gauge(config: Metric): Gauge;
    counter(config: Metric): Counter;
    meter(config: Metric): Meter;
    action(name: string, opts?: Object, fn?: Function): void;
    onExit(callback: Function): any;
    emit(name: string, data: Object): any;
    initModule(opts: any, cb?: Function): any;
    expressErrorHandler(): (err: any, req: any, res: any, next: any) => any;
    koaErrorHandler(): (ctx: any, next: any) => Promise<void>;
}
