import { Feature } from '../featureManager';
export interface ProfilerType {
    init(): void;
    register(): void;
    destroy(): void;
}
export declare class ProfilingConfig {
    cpuJS: boolean;
    heapSnapshot: boolean;
    heapSampling: boolean;
    implementation?: string;
}
export declare class ProfilingFeature implements Feature {
    private profiler;
    private logger;
    init(config?: ProfilingConfig | boolean): any;
    destroy(): void;
}
