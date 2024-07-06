import { MetricInterface } from '../features/metrics';
export declare class NetworkTrafficConfig {
    upload: boolean;
    download: boolean;
}
export default class NetworkMetric implements MetricInterface {
    private metricService;
    private timer;
    private logger;
    private socketProto;
    init(config?: NetworkTrafficConfig | boolean): any;
    destroy(): void;
    private catchDownload;
    private catchUpload;
}
