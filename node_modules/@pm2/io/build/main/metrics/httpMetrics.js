'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpMetricsConfig = void 0;
const shimmer = require("shimmer");
const debug_1 = require("debug");
const configuration_1 = require("../configuration");
const serviceManager_1 = require("../serviceManager");
const histogram_1 = require("../utils/metrics/histogram");
const requireMiddle = require("require-in-the-middle");
const metrics_1 = require("../services/metrics");
class HttpMetricsConfig {
}
exports.HttpMetricsConfig = HttpMetricsConfig;
class HttpMetrics {
    constructor() {
        this.defaultConf = {
            http: true
        };
        this.metrics = new Map();
        this.logger = (0, debug_1.default)('axm:features:metrics:http');
        this.modules = {};
    }
    init(config) {
        if (config === false)
            return;
        if (config === undefined) {
            config = this.defaultConf;
        }
        if (typeof config !== 'object') {
            config = this.defaultConf;
        }
        this.logger('init');
        configuration_1.default.configureModule({
            latency: true
        });
        this.metricService = serviceManager_1.ServiceManager.get('metrics');
        if (this.metricService === undefined)
            return this.logger(`Failed to load metric service`);
        this.logger('hooking to require');
        this.hookRequire();
    }
    registerHttpMetric() {
        if (this.metricService === undefined)
            return this.logger(`Failed to load metric service`);
        const histogram = new histogram_1.default();
        const p50 = {
            name: `HTTP Mean Latency`,
            id: 'internal/http/builtin/latency/p50',
            type: metrics_1.MetricType.histogram,
            historic: true,
            implementation: histogram,
            unit: 'ms',
            handler: () => {
                const percentiles = histogram.percentiles([0.5]);
                return percentiles[0.5];
            }
        };
        const p95 = {
            name: `HTTP P95 Latency`,
            id: 'internal/http/builtin/latency/p95',
            type: metrics_1.MetricType.histogram,
            historic: true,
            implementation: histogram,
            handler: () => {
                const percentiles = histogram.percentiles([0.95]);
                return percentiles[0.95];
            },
            unit: 'ms'
        };
        const meter = {
            name: 'HTTP',
            historic: true,
            id: 'internal/http/builtin/reqs',
            unit: 'req/min'
        };
        this.metricService.registerMetric(p50);
        this.metricService.registerMetric(p95);
        this.metrics.set('http.latency', histogram);
        this.metrics.set('http.meter', this.metricService.meter(meter));
    }
    registerHttpsMetric() {
        if (this.metricService === undefined)
            return this.logger(`Failed to load metric service`);
        const histogram = new histogram_1.default();
        const p50 = {
            name: `HTTPS Mean Latency`,
            id: 'internal/https/builtin/latency/p50',
            type: metrics_1.MetricType.histogram,
            historic: true,
            implementation: histogram,
            unit: 'ms',
            handler: () => {
                const percentiles = histogram.percentiles([0.5]);
                return percentiles[0.5];
            }
        };
        const p95 = {
            name: `HTTPS P95 Latency`,
            id: 'internal/https/builtin/latency/p95',
            type: metrics_1.MetricType.histogram,
            historic: true,
            implementation: histogram,
            handler: () => {
                const percentiles = histogram.percentiles([0.95]);
                return percentiles[0.95];
            },
            unit: 'ms'
        };
        const meter = {
            name: 'HTTPS',
            historic: true,
            id: 'internal/https/builtin/reqs',
            unit: 'req/min'
        };
        this.metricService.registerMetric(p50);
        this.metricService.registerMetric(p95);
        this.metrics.set('https.latency', histogram);
        this.metrics.set('https.meter', this.metricService.meter(meter));
    }
    destroy() {
        if (this.modules.http !== undefined) {
            this.logger('unwraping http module');
            shimmer.unwrap(this.modules.http, 'emit');
            this.modules.http = undefined;
        }
        if (this.modules.https !== undefined) {
            this.logger('unwraping https module');
            shimmer.unwrap(this.modules.https, 'emit');
            this.modules.https = undefined;
        }
        if (this.hooks) {
            this.hooks.unhook();
        }
        this.logger('destroy');
    }
    hookHttp(nodule, name) {
        if (nodule.Server === undefined || nodule.Server.prototype === undefined)
            return;
        if (this.modules[name] !== undefined)
            return this.logger(`Module ${name} already hooked`);
        this.logger(`Hooking to ${name} module`);
        this.modules[name] = nodule.Server.prototype;
        if (name === 'http') {
            this.registerHttpMetric();
        }
        else if (name === 'https') {
            this.registerHttpsMetric();
        }
        const self = this;
        shimmer.wrap(nodule.Server.prototype, 'emit', (original) => {
            return function (event, req, res) {
                if (event !== 'request')
                    return original.apply(this, arguments);
                const meter = self.metrics.get(`${name}.meter`);
                if (meter !== undefined) {
                    meter.mark();
                }
                const latency = self.metrics.get(`${name}.latency`);
                if (latency === undefined)
                    return original.apply(this, arguments);
                if (res === undefined || res === null)
                    return original.apply(this, arguments);
                const startTime = Date.now();
                res.once('finish', _ => {
                    latency.update(Date.now() - startTime);
                });
                return original.apply(this, arguments);
            };
        });
    }
    hookRequire() {
        this.hooks = requireMiddle(['http', 'https'], (exports, name) => {
            this.hookHttp(exports, name);
            return exports;
        });
    }
}
exports.default = HttpMetrics;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaHR0cE1ldHJpY3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbWV0cmljcy9odHRwTWV0cmljcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxZQUFZLENBQUE7OztBQUVaLG1DQUFrQztBQUNsQyxpQ0FBeUI7QUFDekIsb0RBQTRDO0FBRTVDLHNEQUFrRDtBQUVsRCwwREFBa0Q7QUFDbEQsdURBQXNEO0FBRXRELGlEQUs0QjtBQUU1QixNQUFhLGlCQUFpQjtDQUU3QjtBQUZELDhDQUVDO0FBRUQsTUFBcUIsV0FBVztJQUFoQztRQUVVLGdCQUFXLEdBQXNCO1lBQ3ZDLElBQUksRUFBRSxJQUFJO1NBQ1gsQ0FBQTtRQUNPLFlBQU8sR0FBcUIsSUFBSSxHQUFHLEVBQWUsQ0FBQTtRQUNsRCxXQUFNLEdBQVEsSUFBQSxlQUFLLEVBQUMsMkJBQTJCLENBQUMsQ0FBQTtRQUVoRCxZQUFPLEdBQVEsRUFBRSxDQUFBO0lBaUszQixDQUFDO0lBOUpDLElBQUksQ0FBRSxNQUFvQztRQUN4QyxJQUFJLE1BQU0sS0FBSyxLQUFLO1lBQUUsT0FBTTtRQUM1QixJQUFJLE1BQU0sS0FBSyxTQUFTLEVBQUUsQ0FBQztZQUN6QixNQUFNLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQTtRQUMzQixDQUFDO1FBQ0QsSUFBSSxPQUFPLE1BQU0sS0FBSyxRQUFRLEVBQUUsQ0FBQztZQUMvQixNQUFNLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQTtRQUMzQixDQUFDO1FBQ0QsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQTtRQUNuQix1QkFBYSxDQUFDLGVBQWUsQ0FBQztZQUM1QixPQUFPLEVBQUUsSUFBSTtTQUNkLENBQUMsQ0FBQTtRQUNGLElBQUksQ0FBQyxhQUFhLEdBQUcsK0JBQWMsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUE7UUFDbEQsSUFBSSxJQUFJLENBQUMsYUFBYSxLQUFLLFNBQVM7WUFBRSxPQUFPLElB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