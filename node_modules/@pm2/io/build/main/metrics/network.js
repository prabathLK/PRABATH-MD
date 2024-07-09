"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NetworkTrafficConfig = void 0;
const netModule = require("net");
const metrics_1 = require("../services/metrics");
const Debug = require("debug");
const meter_1 = require("../utils/metrics/meter");
const shimmer = require("shimmer");
const serviceManager_1 = require("../serviceManager");
class NetworkTrafficConfig {
}
exports.NetworkTrafficConfig = NetworkTrafficConfig;
const defaultConfig = {
    upload: false,
    download: false
};
const allEnabled = {
    upload: true,
    download: true
};
class NetworkMetric {
    constructor() {
        this.logger = Debug('axm:features:metrics:network');
    }
    init(config) {
        if (config === false)
            return;
        if (config === true) {
            config = allEnabled;
        }
        if (config === undefined) {
            config = defaultConfig;
        }
        this.metricService = serviceManager_1.ServiceManager.get('metrics');
        if (this.metricService === undefined) {
            return this.logger(`Failed to load metric service`);
        }
        if (config.download === true) {
            this.catchDownload();
        }
        if (config.upload === true) {
            this.catchUpload();
        }
        this.logger('init');
    }
    destroy() {
        if (this.timer !== undefined) {
            clearTimeout(this.timer);
        }
        if (this.socketProto !== undefined && this.socketProto !== null) {
            shimmer.unwrap(this.socketProto, 'read');
            shimmer.unwrap(this.socketProto, 'write');
        }
        this.logger('destroy');
    }
    catchDownload() {
        if (this.metricService === undefined)
            return this.logger(`Failed to load metric service`);
        const downloadMeter = new meter_1.default({});
        this.metricService.registerMetric({
            name: 'Network In',
            id: 'internal/network/in',
            historic: true,
            type: metrics_1.MetricType.meter,
            implementation: downloadMeter,
            unit: 'kb/s',
            handler: function () {
                return Math.floor(this.implementation.val() / 1024 * 1000) / 1000;
            }
        });
        setTimeout(() => {
            const property = netModule.Socket.prototype.read;
            const isWrapped = property && property.__wrapped === true;
            if (isWrapped) {
                return this.logger(`Already patched socket read, canceling`);
            }
            shimmer.wrap(netModule.Socket.prototype, 'read', function (original) {
                return function () {
                    this.on('data', (data) => {
                        if (typeof data.length === 'number') {
                            downloadMeter.mark(data.length);
                        }
                    });
                    return original.apply(this, arguments);
                };
            });
        }, 500);
    }
    catchUpload() {
        if (this.metricService === undefined)
            return this.logger(`Failed to load metric service`);
        const uploadMeter = new meter_1.default();
        this.metricService.registerMetric({
            name: 'Network Out',
            id: 'internal/network/out',
            type: metrics_1.MetricType.meter,
            historic: true,
            implementation: uploadMeter,
            unit: 'kb/s',
            handler: function () {
                return Math.floor(this.implementation.val() / 1024 * 1000) / 1000;
            }
        });
        setTimeout(() => {
            const property = netModule.Socket.prototype.write;
            const isWrapped = property && property.__wrapped === true;
            if (isWrapped) {
                return this.logger(`Already patched socket write, canceling`);
            }
            shimmer.wrap(netModule.Socket.prototype, 'write', function (original) {
                return function (data) {
                    if (typeof data.length === 'number') {
                        uploadMeter.mark(data.length);
                    }
                    return original.apply(this, arguments);
                };
            });
        }, 500);
    }
}
exports.default = NetworkMetric;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmV0d29yay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9tZXRyaWNzL25ldHdvcmsudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsaUNBQWdDO0FBQ2hDLGlEQUErRDtBQUUvRCwrQkFBOEI7QUFDOUIsa0RBQTBDO0FBQzFDLG1DQUFrQztBQUNsQyxzREFBa0Q7QUFFbEQsTUFBYSxvQkFBb0I7Q0FHaEM7QUFIRCxvREFHQztBQUVELE1BQU0sYUFBYSxHQUF5QjtJQUMxQyxNQUFNLEVBQUUsS0FBSztJQUNiLFFBQVEsRUFBRSxLQUFLO0NBQ2hCLENBQUE7QUFFRCxNQUFNLFVBQVUsR0FBeUI7SUFDdkMsTUFBTSxFQUFFLElBQUk7SUFDWixRQUFRLEVBQUUsSUFBSTtDQUNmLENBQUE7QUFFRCxNQUFxQixhQUFhO0lBQWxDO1FBR1UsV0FBTSxHQUFhLEtBQUssQ0FBQyw4QkFBOEIsQ0FBQyxDQUFBO0lBMkdsRSxDQUFDO0lBeEdDLElBQUksQ0FBRSxNQUF1QztRQUMzQyxJQUFJLE1BQU0sS0FBSyxLQUFLO1lBQUUsT0FBTTtRQUM1QixJQUFJLE1BQU0sS0FBSyxJQUFJLEVBQUUsQ0FBQztZQUNwQixNQUFNLEdBQUcsVUFBVSxDQUFBO1FBQ3JCLENBQUM7UUFDRCxJQUFJLE1BQU0sS0FBSyxTQUFTLEVBQUUsQ0FBQztZQUN6QixNQUFNLEdBQUcsYUFBYSxDQUFBO1FBQ3hCLENBQUM7UUFFRCxJQUFJLENBQUMsYUFBYSxHQUFHLCtCQUFjLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFBO1FBQ2xELElBQUksSUFBSSxDQUFDLGFBQWEsS0FBSyxTQUFTLEVBQUUsQ0FBQztZQUNyQyxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsK0JBQStCLENBQUMsQ0FBQTtRQUNyRCxDQUFDO1FBRUQsSUFBSSxNQUFNLENBQUMsUUFBUSxLQUFLLElBQUksRUFBRSxDQUFDO1lBQzdCLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQTtR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