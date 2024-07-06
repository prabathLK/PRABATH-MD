"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const module_1 = require("../utils/module");
const configuration_1 = require("../configuration");
const serviceManager_1 = require("../serviceManager");
const miscellaneous_1 = require("../utils/miscellaneous");
const Debug = require("debug");
class CurrentProfile {
}
class AddonProfiler {
    constructor() {
        this.profiler = null;
        this.modules = ['v8-profiler-node8', 'v8-profiler'];
        this.currentProfile = null;
        this.logger = Debug('axm:features:profiling:addon');
    }
    init() {
        for (const moduleName of this.modules) {
            let path = module_1.default.detectModule(moduleName);
            if (path === null)
                continue;
            let profiler = module_1.default.loadModule(moduleName);
            if (profiler instanceof Error)
                continue;
            this.profiler = profiler;
            break;
        }
        if (this.profiler === null) {
            configuration_1.default.configureModule({
                heapdump: false,
                'feature.profiler.heap_snapshot': false,
                'feature.profiler.heap_sampling': false,
                'feature.profiler.cpu_js': false
            });
            return this.logger(`Failed to require the profiler via addon, disabling profiling ...`);
        }
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
            'feature.profiler.heapsnapshot': true,
            'feature.profiler.heapsampling': false,
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
    }
    destroy() {
        this.logger('Addon Profiler destroyed !');
        if (this.profiler === null)
            return;
        this.profiler.deleteAllProfiles();
    }
    onCPUProfileStart(opts, cb) {
        if (typeof cb !== 'function') {
            cb = opts;
            opts = {};
        }
        if (typeof opts !== 'object' || opts === null) {
            opts = {};
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
        this.profiler.startProfiling();
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
        if (this.transport === undefined) {
            return cb({
                err: 'No profiling are already running',
                success: false
            });
        }
        const profile = this.profiler.stopProfiling();
        const data = JSON.stringify(profile);
        cb({ success: true, uuid: this.currentProfile.uuid });
        this.transport.send('profilings', {
            uuid: this.currentProfile.uuid,
            duration: Date.now() - this.currentProfile.startTime,
            at: this.currentProfile.startTime,
            data,
            dump_file_size: data.length,
            success: true,
            initiated: this.currentProfile.initiated,
            type: 'cpuprofile',
            cpuprofile: true
        });
        this.currentProfile = null;
    }
    onHeapdump(opts, cb) {
        if (typeof cb !== 'function') {
            cb = opts;
            opts = {};
        }
        if (typeof opts !== 'object' || opts === null) {
            opts = {};
        }
        cb({ success: true });
        setTimeout(() => {
            const startTime = Date.now();
            this.takeSnapshot()
                .then((data) => {
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
        return new Promise((resolve, reject) => {
            const snapshot = this.profiler.takeSnapshot();
            snapshot.export((err, data) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(data);
                }
                snapshot.delete();
            });
        });
    }
}
exports.default = AddonProfiler;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWRkb25Qcm9maWxlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9wcm9maWxlcnMvYWRkb25Qcm9maWxlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUNBLDRDQUFtQztBQUNuQyxvREFBNEM7QUFDNUMsc0RBQWtEO0FBR2xELDBEQUE4QztBQUM5QywrQkFBOEI7QUFFOUIsTUFBTSxjQUFjO0NBSW5CO0FBRUQsTUFBcUIsYUFBYTtJQUFsQztRQUVVLGFBQVEsR0FBUSxJQUFJLENBQUE7UUFNcEIsWUFBTyxHQUFHLENBQUUsbUJBQW1CLEVBQUUsYUFBYSxDQUFFLENBQUE7UUFHaEQsbUJBQWMsR0FBMEIsSUFBSSxDQUFBO1FBQzVDLFdBQU0sR0FBYSxLQUFLLENBQUMsOEJBQThCLENBQUMsQ0FBQTtJQW9MbEUsQ0FBQztJQWxMQyxJQUFJO1FBQ0YsS0FBSyxNQUFNLFVBQVUsSUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7WUFDdEMsSUFBSSxJQUFJLEdBQUcsZ0JBQUssQ0FBQyxZQUFZLENBQUMsVUFBVSxDQUFDLENBQUE7WUFFekMsSUFBSSxJQUFJLEtBQUssSUFBSTtnQkFBRSxTQUFRO1lBQzNCLElBQUksUUFBUSxHQUFHLGdCQUFLLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxDQUFBO1lBRTNDLElBQUksUUFBUSxZQUFZLEtBQUs7Z0JBQUUsU0FBUTtZQUN2QyxJQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQTtZQUN4QixNQUFLO1FBQ1AsQ0FBQztRQUNELElBQUksSUFBSSxDQUFDLFFBQVEsS0FBSyxJQUFJLEVBQUUsQ0FBQztZQUMzQix1QkFBYSxDQUFDLGVBQWUsQ0FBQztnQkFDNUIsUUFBUSxFQUFFLEtBQUs7Z0JBQ2YsZ0NBQWdDLEVBQUUsS0FBSztnQkFDdkMsZ0NBQWdDLEVBQUUsS0FBSztnQkFDdkMseUJBQXlCLEVBQUUsS0FBSzthQUNqQyxDQUFDLENBQUE7WUFDRixPQUFPLElBQUks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