'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventLoopMetricOption = void 0;
const metrics_1 = require("../services/metrics");
const serviceManager_1 = require("../serviceManager");
const Debug = require("debug");
const histogram_1 = require("../utils/metrics/histogram");
class EventLoopMetricOption {
}
exports.EventLoopMetricOption = EventLoopMetricOption;
const defaultOptions = {
    eventLoopActive: true,
    eventLoopDelay: true
};
class EventLoopHandlesRequestsMetric {
    constructor() {
        this.logger = Debug('axm:features:metrics:eventloop');
        this.delayLoopInterval = 1000;
    }
    init(config) {
        if (config === false)
            return;
        if (config === undefined) {
            config = defaultOptions;
        }
        if (config === true) {
            config = defaultOptions;
        }
        this.metricService = serviceManager_1.ServiceManager.get('metrics');
        if (this.metricService === undefined)
            return this.logger('Failed to load metric service');
        this.logger('init');
        if (typeof process._getActiveRequests === 'function' && config.eventLoopActive === true) {
            const requestMetric = this.metricService.metric({
                name: 'Active requests',
                id: 'internal/libuv/requests',
                historic: true
            });
            this.requestTimer = setInterval(_ => {
                requestMetric.set(process._getActiveRequests().length);
            }, 1000);
            this.requestTimer.unref();
        }
        if (typeof process._getActiveHandles === 'function' && config.eventLoopActive === true) {
            const handleMetric = this.metricService.metric({
                name: 'Active handles',
                id: 'internal/libuv/handles',
                historic: true
            });
            this.handleTimer = setInterval(_ => {
                handleMetric.set(process._getActiveHandles().length);
            }, 1000);
            this.handleTimer.unref();
        }
        if (config.eventLoopDelay === false)
            return;
        const histogram = new histogram_1.default();
        const uvLatencyp50 = {
            name: 'Event Loop Latency',
            id: 'internal/libuv/latency/p50',
            type: metrics_1.MetricType.histogram,
            historic: true,
            implementation: histogram,
            handler: function () {
                const percentiles = this.implementation.percentiles([0.5]);
                if (percentiles[0.5] === null)
                    return null;
                return percentiles[0.5].toFixed(2);
            },
            unit: 'ms'
        };
        const uvLatencyp95 = {
            name: 'Event Loop Latency p95',
            id: 'internal/libuv/latency/p95',
            type: metrics_1.MetricType.histogram,
            historic: true,
            implementation: histogram,
            handler: function () {
                const percentiles = this.implementation.percentiles([0.95]);
                if (percentiles[0.95] === null)
                    return null;
                return percentiles[0.95].toFixed(2);
            },
            unit: 'ms'
        };
        this.metricService.registerMetric(uvLatencyp50);
        this.metricService.registerMetric(uvLatencyp95);
        this.runtimeStatsService = serviceManager_1.ServiceManager.get('runtimeStats');
        if (this.runtimeStatsService === undefined) {
            this.logger('runtimeStats module not found, fallbacking into pure js method');
            let oldTime = process.hrtime();
            this.delayTimer = setInterval(() => {
                const newTime = process.hrtime();
                const delay = (newTime[0] - oldTime[0]) * 1e3 + (newTime[1] - oldTime[1]) / 1e6 - this.delayLoopInterval;
                oldTime = newTime;
                histogram.update(delay);
            }, this.delayLoopInterval);
            this.delayTimer.unref();
        }
        else {
            this.logger('using runtimeStats module as data source for event loop latency');
            this.handle = (stats) => {
                if (typeof stats !== 'object' || !Array.isArray(stats.ticks))
                    return;
                stats.ticks.forEach((tick) => {
                    histogram.update(tick);
                });
            };
            this.runtimeStatsService.on('data', this.handle);
        }
    }
    destroy() {
        if (this.requestTimer !== undefined) {
            clearInterval(this.requestTimer);
        }
        if (this.handleTimer !== undefined) {
            clearInterval(this.handleTimer);
        }
        if (this.delayTimer !== undefined) {
            clearInterval(this.delayTimer);
        }
        if (this.runtimeStatsService !== undefined) {
            this.runtimeStatsService.removeListener('data', this.handle);
        }
        this.logger('destroy');
    }
}
exports.default = EventLoopHandlesRequestsMetric;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXZlbnRMb29wTWV0cmljcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9tZXRyaWNzL2V2ZW50TG9vcE1ldHJpY3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsWUFBWSxDQUFBOzs7QUFFWixpREFBK0U7QUFDL0Usc0RBQWtEO0FBQ2xELCtCQUE4QjtBQUU5QiwwREFBa0Q7QUFHbEQsTUFBYSxxQkFBcUI7Q0FXakM7QUFYRCxzREFXQztBQUVELE1BQU0sY0FBYyxHQUEwQjtJQUM1QyxlQUFlLEVBQUUsSUFBSTtJQUNyQixjQUFjLEVBQUUsSUFBSTtDQUNyQixDQUFBO0FBRUQsTUFBcUIsOEJBQThCO0lBQW5EO1FBR1UsV0FBTSxHQUFRLEtBQUssQ0FBQyxnQ0FBZ0MsQ0FBQyxDQUFBO1FBSXJELHNCQUFpQixHQUFXLElBQUksQ0FBQTtJQWlIMUMsQ0FBQztJQTdHQyxJQUFJLENBQUUsTUFBd0M7UUFDNUMsSUFBSSxNQUFNLEtBQUssS0FBSztZQUFFLE9BQU07UUFDNUIsSUFBSSxNQUFNLEtBQUssU0FBUyxFQUFFLENBQUM7WUFDekIsTUFBTSxHQUFHLGNBQWMsQ0FBQTtRQUN6QixDQUFDO1FBQ0QsSUFBSSxNQUFNLEtBQUssSUFBSSxFQUFFLENBQUM7WUFDcEIsTUFBTSxHQUFHLGNBQWMsQ0FBQTtRQUN6QixDQUFDO1FBQ0QsSUFBSSxDQUFDLGFBQWEsR0FBRywrQkFBYyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQTtRQUNsRCxJQUFJLElBQUksQ0FBQyxhQUFhLEtBQUssU0FBUztZQUFFLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQywrQkFBK0IsQ0FBQyxDQUFBO1FBRXpGLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUE7UUFDbkIsSUFBSSxPQUFRLE9BQWUsQ0FBQyxrQkFBa0IsS0FBSyxVQUFVLElBQUksTUFBTSxDQUFDLGVBQWUsS0FBSyxJQUFJLEVBQUUsQ0FBQztZQUNqRyxNQUFN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