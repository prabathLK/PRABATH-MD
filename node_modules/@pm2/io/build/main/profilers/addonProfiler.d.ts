import { ProfilerType } from '../features/profiling';
export default class AddonProfiler implements ProfilerType {
    private profiler;
    private modules;
    private actionService;
    private transport;
    private currentProfile;
    private logger;
    init(): any;
    register(): any;
    destroy(): void;
    private onCPUProfileStart;
    private onCPUProfileStop;
    private onHeapdump;
    private takeSnapshot;
}
