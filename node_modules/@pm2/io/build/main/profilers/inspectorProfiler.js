"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const configuration_1 = require("../configuration");
const serviceManager_1 = require("../serviceManager");
const miscellaneous_1 = require("../utils/miscellaneous");
const Debug = require("debug");
const semver = require("semver");
class CurrentProfile {
}
class InspectorProfiler {
    constructor() {
        this.profiler = undefined;
        this.currentProfile = null;
        this.logger = Debug('axm:features:profiling:inspector');
        this.isNode11 = semver.satisfies(semver.clean(process.version), '>11.x');
    }
    init() {
        this.profiler = serviceManager_1.ServiceManager.get('inspector');
        if (this.profiler === undefined) {
            configuration_1.default.configureModule({
                heapdump: false,
                'feature.profiler.heap_snapshot': false,
                'feature.profiler.heap_sampling': false,
                'feature.profiler.cpu_js': false
            });
            return console.error(`Failed to require the profiler via inspector, disabling profiling ...`);
        }
        this.profiler.getSession().post('Profiler.enable');
        this.profiler.getSession().post('HeapProfiler.enable');
        this.logger('init');
        this.actionService = serviceManager_1.ServiceManager.get('actions');
        if (this.actionService === undefined) {
            return this.logger(`Fail to get action service`);
        }
        this.transport = serviceManager_1.ServiceManager.get('transport');
        if (this.transport === undefined) {
            return this.logger(`Fail to get transport service`);
        }
        configuration_1.default.configureModule({
            heapdump: true,
            'feature.profiler.heapsnapshot': !this.isNode11,
            'feature.profiler.heapsampling': true,
            'feature.profiler.cpu_js': true
        });
        this.register();
    }
    register() {
        if (this.actionService === undefined) {
            return this.logger(`Fail to get action service`);
        }
        this.logger('register');
        this.actionService.registerAction('km:heapdump', this.onHeapdump.bind(this));
        this.actionService.registerAction('km:cpu:profiling:start', this.onCPUProfileStart.bind(this));
        this.actionService.registerAction('km:cpu:profiling:stop', this.onCPUProfileStop.bind(this));
        this.actionService.registerAction('km:heap:sampling:start', this.onHeapProfileStart.bind(this));
        this.actionService.registerAction('km:heap:sampling:stop', this.onHeapProfileStop.bind(this));
    }
    destroy() {
        this.logger('Inspector Profiler destroyed !');
        if (this.profiler === undefined)
            return;
        this.profiler.getSession().post('Profiler.disable');
        this.profiler.getSession().post('HeapProfiler.disable');
    }
    onHeapProfileStart(opts, cb) {
        if (typeof cb !== 'function') {
            cb = opts;
            opts = {};
        }
        if (typeof opts !== 'object' || opts === null) {
            opts = {};
        }
        if (this.profiler === undefined) {
            return cb({
                err: 'Profiler not available',
                success: false
            });
        }
        if (this.currentProfile !== null) {
            return cb({
                err: 'A profiling is already running',
                success: false
            });
        }
        this.currentProfile = new CurrentProfile();
        this.currentProfile.uuid = miscellaneous_1.default.generateUUID();
        this.currentProfile.startTime = Date.now();
        this.currentProfile.initiated = typeof opts.initiated === 'string'
            ? opts.initiated : 'manual';
        cb({ success: true, uuid: this.currentProfile.uuid });
        const defaultSamplingInterval = 16384;
        this.profiler.getSession().post('HeapProfiler.startSampling', {
            samplingInterval: typeof opts.samplingInterval === 'number'
                ? opts.samplingInterval : defaultSamplingInterval
        });
        if (isNaN(parseInt(opts.timeout, 10)))
            return;
        const duration = parseInt(opts.timeout, 10);
        setTimeout(_ => {
            this.onHeapProfileStop(_ => {
                return;
            });
        }, duration);
    }
    onHeapProfileStop(cb) {
        if (this.currentProfile === null) {
            return cb({
                err: 'No profiling are already running',
                success: false
            });
        }
        if (this.profiler === undefined) {
            return cb({
                err: 'Profiler not available',
                success: false
            });
        }
        cb({ success: true, uuid: this.currentProfile.uuid });
        this.profiler.getSession().post('HeapProfiler.stopSampling', (_, { profile }) => {
            if (this.currentProfile === null)
                return;
            if (this.transport === undefined)
                return;
            const data = JSON.stringify(profile);
            this.transport.send('profilings', {
                uuid: this.currentProfile.uuid,
                duration: Date.now() - this.currentProfile.startTime,
                at: this.currentProfile.startTime,
                data,
                success: true,
                initiated: this.currentProfile.initiated,
                type: 'heapprofile',
                heapprofile: true
            });
            this.currentProfile = null;
        });
    }
    onCPUProfileStart(opts, cb) {
        if (typeof cb !== 'function') {
            cb = opts;
            opts = {};
        }
        if (typeof opts !== 'object' || opts === null) {
            opts = {};
        }
        if (this.profiler === undefined) {
            return cb({
                err: 'Profiler not available',
                success: false
            });
        }
        if (this.currentProfile !== null) {
            return cb({
                err: 'A profiling is already running',
                success: false
            });
        }
        this.currentProfile = new CurrentProfile();
        this.currentProfile.uuid = miscellaneous_1.default.generateUUID();
        this.currentProfile.startTime = Date.now();
        this.currentProfile.initiated = typeof opts.initiated === 'string'
            ? opts.initiated : 'manual';
        cb({ success: true, uuid: this.currentProfile.uuid });
        if (process.hasOwnProperty('_startProfilerIdleNotifier') === true) {
            process._startProfilerIdleNotifier();
        }
        this.profiler.getSession().post('Profiler.start');
        if (isNaN(parseInt(opts.timeout, 10)))
            return;
        const duration = parseInt(opts.timeout, 10);
        setTimeout(_ => {
            this.onCPUProfileStop(_ => {
                return;
            });
        }, duration);
    }
    onCPUProfileStop(cb) {
        if (this.currentProfile === null) {
            return cb({
                err: 'No profiling are already running',
                success: false
            });
        }
        if (this.profiler === undefined) {
            return cb({
                err: 'Profiler not available',
                success: false
            });
        }
        cb({ success: true, uuid: this.currentProfile.uuid });
        if (process.hasOwnProperty('_stopProfilerIdleNotifier') === true) {
            process._stopProfilerIdleNotifier();
        }
        this.profiler.getSession().post('Profiler.stop', (_, res) => {
            if (this.currentProfile === null)
                return;
            if (this.transport === undefined)
                return;
            const profile = res.profile;
            const data = JSON.stringify(profile);
            this.transport.send('profilings', {
                uuid: this.currentProfile.uuid,
                duration: Date.now() - this.currentProfile.startTime,
                at: this.currentProfile.startTime,
                data,
                success: true,
                initiated: this.currentProfile.initiated,
                type: 'cpuprofile',
                cpuprofile: true
            });
            this.currentProfile = null;
        });
    }
    onHeapdump(opts, cb) {
        if (typeof cb !== 'function') {
            cb = opts;
            opts = {};
        }
        if (typeof opts !== 'object' || opts === null) {
            opts = {};
        }
        if (this.profiler === undefined) {
            return cb({
                err: 'Profiler not available',
                success: false
            });
        }
        cb({ success: true });
        setTimeout(() => {
            const startTime = Date.now();
            this.takeSnapshot()
                .then(data => {
                return this.transport.send('profilings', {
                    data,
                    at: startTime,
                    initiated: typeof opts.initiated === 'string' ? opts.initiated : 'manual',
                    duration: Date.now() - startTime,
                    type: 'heapdump'
                });
            }).catch(err => {
                return cb({
                    success: err.message,
                    err: err
                });
            });
        }, 200);
    }
    takeSnapshot() {
        return new Promise((resolve, reject) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (this.profiler === undefined)
                return reject(new Error(`Profiler not available`));
            const chunks = [];
            const chunkHandler = (raw) => {
                const data = raw.params;
                chunks.push(data.chunk);
            };
            this.profiler.getSession().on('HeapProfiler.addHeapSnapshotChunk', chunkHandler);
            yield this.profiler.getSession().post('HeapProfiler.takeHeapSnapshot', {
                reportProgress: false
            });
            this.profiler.getSession().removeListener('HeapProfiler.addHeapSnapshotChunk', chunkHandler);
            return resolve(chunks.join(''));
        }));
    }
}
exports.default = InspectorProfiler;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5zcGVjdG9yUHJvZmlsZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvcHJvZmlsZXJzL2luc3BlY3RvclByb2ZpbGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUVBLG9EQUE0QztBQUM1QyxzREFBa0Q7QUFHbEQsMERBQThDO0FBRzlDLCtCQUE4QjtBQUM5QixpQ0FBZ0M7QUFFaEMsTUFBTSxjQUFjO0NBSW5CO0FBRUQsTUFBcUIsaUJBQWlCO0lBQXRDO1FBRVUsYUFBUSxHQUFpQyxTQUFTLENBQUE7UUFHbEQsbUJBQWMsR0FBMEIsSUFBSSxDQUFBO1FBQzVDLFdBQU0sR0FBYSxLQUFLLENBQUMsa0NBQWtDLENBQUMsQ0FBQTtRQUM1RCxhQUFRLEdBQVksTUFBTSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQTtJQWdUdEYsQ0FBQztJQTlTQyxJQUFJO1FBQ0YsSUFBSSxDQUFDLFFBQVEsR0FBRywrQkFBYyxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsQ0FBQTtRQUMvQyxJQUFJLElBQUksQ0FBQyxRQUFRLEtBQUssU0FBUyxFQUFFLENBQUM7WUFDaEMsdUJBQWEsQ0FBQyxlQUFlLENBQUM7Z0JBQzVCLFFBQVEsRUFBRSxLQUFLO2dCQUNmLGdDQUFnQyxFQUFFLEtBQUs7Z0JBQ3ZDLGdDQUFnQyxFQUFFLEtBQUs7Z0JBQ3ZDLHlCQUF5QixFQUFFLEtBQUs7YUFDakMsQ0FBQyxDQUFBO1lBQ0YsT0FBTyxPQUFPLENBQUMsS0FBSyxDQUFDLHVFQUF1RSxDQUFDLENBQUE7UUFDL0YsQ0FBQztRQUVELElBQUksQ0FBQyxRQUFRLENBQUMsVUFBVSxFQUFFLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUE7UUFDbEQsSUFBSSxDQUFDLFFBQVEsQ0FBQyxVQUFVLEVBQUUsQ0FBQyxJQUFJLENBQUMscUJBQXFCLENBQUMs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