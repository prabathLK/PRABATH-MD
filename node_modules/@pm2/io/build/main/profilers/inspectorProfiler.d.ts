import { ProfilerType } from '../features/profiling';
export default class InspectorProfiler implements ProfilerType {
    private profiler;
    private actionService;
    private transport;
    private currentProfile;
    private logger;
    private isNode11;
    init(): any;
    register(): any;
    destroy(): void;
    private onHeapProfileStart;
    private onHeapProfileStop;
    private onCPUProfileStart;
    private onCPUProfileStop;
    private onHeapdump;
    takeSnapshot(): Promise<unknown>;
}
