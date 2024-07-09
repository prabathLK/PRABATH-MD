"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.V8MetricsConfig = void 0;
const v8 = require("v8");
const debug_1 = require("debug");
const serviceManager_1 = require("../serviceManager");
class V8MetricsConfig {
}
exports.V8MetricsConfig = V8MetricsConfig;
const defaultOptions = {
    new_space: false,
    old_space: false,
    map_space: false,
    code_space: false,
    large_object_space: false,
    heap_total_size: true,
    heap_used_size: true,
    heap_used_percent: true
};
class V8Metric {
    constructor() {
        this.TIME_INTERVAL = 800;
        this.logger = (0, debug_1.default)('axm:features:metrics:v8');
        this.metricStore = new Map();
        this.unitKB = 'MiB';
        this.metricsDefinitions = {
            total_heap_size: {
                name: 'Heap Size',
                id: 'internal/v8/heap/total',
                unit: this.unitKB,
                historic: true
            },
            heap_used_percent: {
                name: 'Heap Usage',
                id: 'internal/v8/heap/usage',
                unit: '%',
                historic: true
            },
            used_heap_size: {
                name: 'Used Heap Size',
                id: 'internal/v8/heap/used',
                unit: this.unitKB,
                historic: true
            }
        };
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
        if (!v8.hasOwnProperty('getHeapStatistics')) {
            return this.logger(`V8.getHeapStatistics is not available, aborting`);
        }
        for (let metricName in this.metricsDefinitions) {
            if (config[metricName] === false)
                continue;
            const isEnabled = config[metricName];
            if (isEnabled === false)
                continue;
            let metric = this.metricsDefinitions[metricName];
            this.metricStore.set(metricName, this.metricService.metric(metric));
        }
        this.timer = setInterval(() => {
            const stats = v8.getHeapStatistics();
            for (let metricName in this.metricsDefinitions) {
                if (typeof stats[metricName] !== 'number')
                    continue;
                const gauge = this.metricStore.get(metricName);
                if (gauge === undefined)
                    continue;
                gauge.set(this.formatMiBytes(stats[metricName]));
            }
            const usage = (stats.used_heap_size / stats.total_heap_size * 100).toFixed(2);
            const usageMetric = this.metricStore.get('heap_used_percent');
            if (usageMetric !== undefined) {
                usageMetric.set(parseFloat(usage));
            }
        }, this.TIME_INTERVAL);
        this.timer.unref();
    }
    destroy() {
        if (this.timer !== undefined) {
            clearInterval(this.timer);
        }
        this.logger('destroy');
    }
    formatMiBytes(val) {
        return (val / 1024 / 1024).toFixed(2);
    }
}
exports.default = V8Metric;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidjguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbWV0cmljcy92OC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSx5QkFBd0I7QUFHeEIsaUNBQXlCO0FBQ3pCLHNEQUFrRDtBQUlsRCxNQUFhLGVBQWU7Q0FTM0I7QUFURCwwQ0FTQztBQUdELE1BQU0sY0FBYyxHQUFvQjtJQUN0QyxTQUFTLEVBQUUsS0FBSztJQUNoQixTQUFTLEVBQUUsS0FBSztJQUNoQixTQUFTLEVBQUUsS0FBSztJQUNoQixVQUFVLEVBQUUsS0FBSztJQUNqQixrQkFBa0IsRUFBRSxLQUFLO0lBQ3pCLGVBQWUsRUFBRSxJQUFJO0lBQ3JCLGNBQWMsRUFBRSxJQUFJO0lBQ3BCLGlCQUFpQixFQUFFLElBQUk7Q0FDeEIsQ0FBQTtBQUVELE1BQXFCLFFBQVE7SUFBN0I7UUFHVSxrQkFBYSxHQUFXLEdBQUcsQ0FBQTtRQUUzQixXQUFNLEdBQWEsSUFBQSxlQUFLLEVBQUMseUJBQXlCLENBQUMsQ0FBQTtRQUNuRCxnQkFBVyxHQUF1QixJQUFJLEdBQUcsRUFBaUIsQ0FBQTtRQUUxRCxXQUFNLEdBQUcsS0FBSyxDQUFBO1FBRWQsdUJBQWtCLEdBQUc7WUFnQzNCLGVBQWUsRUFBRTtnQkFDZixJQUFJLEVBQUUsV0FBVztnQkFDakIsRUFBRSxFQUFFLHdCQUF3QjtnQkFDNUIsSUFBSSxFQUFFLElBQUksQ0FBQyxNQUFNO2dCQUNqQixRQUFRLEVBQUUsSUFBSTthQUNmO1lBQ0QsaUJBQWlCLEVBQUU7Z0JBQ2pCLElBQUksRUFBRSxZQUFZO2dCQUNsQixFQUFFLEVBQUUsd0JBQXdCO2dCQUM1QixJQUFJLEVBQUUsR0FBRztnQkFDVCxRQUFRLEVBQUUsSUFBSTthQUNmO1lBQ0QsY0FBYyxFQUFFO2dCQUNkLElBQUksRUFBRSxnQkFBZ0I7Z0JBQ3RCLEVBQUUsRUFBRSx1QkFBdUI7Z0JBQzNCLElBQUksRUFBRSxJQUFJLENBQUMsTUFBTTtnQkFDakIsUUFB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