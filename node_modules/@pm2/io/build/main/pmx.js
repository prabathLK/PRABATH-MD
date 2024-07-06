'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultConfig = exports.IOConfig = void 0;
const configuration_1 = require("./configuration");
const debug_1 = require("debug");
const serviceManager_1 = require("./serviceManager");
const transport_1 = require("./services/transport");
const featureManager_1 = require("./featureManager");
const actions_1 = require("./services/actions");
const metrics_1 = require("./services/metrics");
const constants_1 = require("./constants");
const runtimeStats_1 = require("./services/runtimeStats");
const entrypoint_1 = require("./features/entrypoint");
class IOConfig {
    constructor() {
        this.catchExceptions = true;
        this.profiling = true;
        this.standalone = false;
    }
}
exports.IOConfig = IOConfig;
exports.defaultConfig = {
    catchExceptions: true,
    profiling: true,
    metrics: {
        v8: true,
        network: false,
        eventLoop: true,
        runtime: true,
        http: true
    },
    standalone: false,
    apmOptions: undefined,
};
class PMX {
    constructor() {
        this.featureManager = new featureManager_1.FeatureManager();
        this.transport = null;
        this.actionService = null;
        this.metricService = null;
        this.runtimeStatsService = null;
        this.logger = (0, debug_1.default)('axm:main');
        this.initialized = false;
        this.Entrypoint = entrypoint_1.Entrypoint;
    }
    init(config) {
        const callsite = (new Error().stack || '').split('\n')[2];
        if (callsite && callsite.length > 0) {
            this.logger(`init from ${callsite}`);
        }
        if (this.initialized === true) {
            this.logger(`Calling init but was already the case, destroying and recreating`);
            this.destroy();
        }
        if (config === undefined) {
            config = exports.defaultConfig;
        }
        if (!config.standalone) {
            const autoStandalone = process.env.PM2_SECRET_KEY && process.env.PM2_PUBLIC_KEY && process.env.PM2_APP_NAME;
            config.standalone = !!autoStandalone;
            config.apmOptions = autoStandalone ? {
                secretKey: process.env.PM2_SECRET_KEY,
                publicKey: process.env.PM2_PUBLIC_KEY,
                appName: process.env.PM2_APP_NAME
            } : undefined;
        }
        this.transport = (0, transport_1.createTransport)(config.standalone === true ? 'websocket' : 'ipc', config.apmOptions);
        serviceManager_1.ServiceManager.set('transport', this.transport);
        if ((0, constants_1.canUseInspector)()) {
            const Inspector = require('./services/inspector');
            const inspectorService = new Inspector();
            inspectorService.init();
            serviceManager_1.ServiceManager.set('inspector', inspectorService);
        }
        this.actionService = new actions_1.ActionService();
        this.actionService.init();
        serviceManager_1.ServiceManager.set('actions', this.actionService);
        this.metricService = new metrics_1.MetricService();
        this.metricService.init();
        serviceManager_1.ServiceManager.set('metrics', this.metricService);
        this.runtimeStatsService = new runtimeStats_1.RuntimeStatsService();
        this.runtimeStatsService.init();
        if (this.runtimeStatsService.isEnabled()) {
            serviceManager_1.ServiceManager.set('runtimeStats', this.runtimeStatsService);
        }
        this.featureManager.init(config);
        configuration_1.default.init(config);
        this.initialConfig = config;
        this.initialized = true;
        return this;
    }
    destroy() {
        this.logger('destroy');
        this.featureManager.destroy();
        if (this.actionService !== null) {
            this.actionService.destroy();
        }
        if (this.transport !== null) {
            this.transport.destroy();
        }
        if (this.metricService !== null) {
            this.metricService.destroy();
        }
        if (this.runtimeStatsService !== null) {
            this.runtimeStatsService.destroy();
        }
        const inspectorService = serviceManager_1.ServiceManager.get('inspector');
        if (inspectorService !== undefined) {
            inspectorService.destroy();
        }
    }
    getConfig() {
        return this.initialConfig;
    }
    notifyError(error, context) {
        const notify = this.featureManager.get('notify');
        return notify.notifyError(error, context);
    }
    metrics(metric) {
        const res = [];
        if (metric === undefined || metric === null) {
            console.error(`Received empty metric to create`);
            console.trace();
            return [];
        }
        let metrics = !Array.isArray(metric) ? [metric] : metric;
        for (let metric of metrics) {
            if (typeof metric.name !== 'string') {
                console.error(`Trying to create a metrics without a name`, metric);
                console.trace();
                res.push({});
                continue;
            }
            if (metric.type === undefined) {
                metric.type = metrics_1.MetricType.gauge;
            }
            switch (metric.type) {
                case metrics_1.MetricType.counter: {
                    res.push(this.counter(metric));
                    continue;
                }
                case metrics_1.MetricType.gauge: {
                    res.push(this.gauge(metric));
                    continue;
                }
                case metrics_1.MetricType.histogram: {
                    res.push(this.histogram(metric));
                    continue;
                }
                case metrics_1.MetricType.meter: {
                    res.push(this.meter(metric));
                    continue;
                }
                case metrics_1.MetricType.metric: {
                    res.push(this.gauge(metric));
                    continue;
                }
                default: {
                    console.error(`Invalid metric type ${metric.type} for metric ${metric.name}`);
                    console.trace();
                    res.push({});
                    continue;
                }
            }
        }
        return res;
    }
    histogram(config) {
        if (typeof config === 'string') {
            config = {
                name: config,
                measurement: metrics_1.MetricMeasurements.mean
            };
        }
        if (this.metricService === null) {
            return console.trace(`Tried to register a metric without initializing @pm2/io`);
        }
        return this.metricService.histogram(config);
    }
    metric(config) {
        if (typeof config === 'string') {
            config = {
                name: config
            };
        }
        if (this.metricService === null) {
            return console.trace(`Tried to register a metric without initializing @pm2/io`);
        }
        return this.metricService.metric(config);
    }
    gauge(config) {
        if (typeof config === 'string') {
            config = {
                name: config
            };
        }
        if (this.metricService === null) {
            return console.trace(`Tried to register a metric without initializing @pm2/io`);
        }
        return this.metricService.metric(config);
    }
    counter(config) {
        if (typeof config === 'string') {
            config = {
                name: config
            };
        }
        if (this.metricService === null) {
            return console.trace(`Tried to register a metric without initializing @pm2/io`);
        }
        return this.metricService.counter(config);
    }
    meter(config) {
        if (typeof config === 'string') {
            config = {
                name: config
            };
        }
        if (this.metricService === null) {
            return console.trace(`Tried to register a metric without initializing @pm2/io`);
        }
        return this.metricService.meter(config);
    }
    action(name, opts, fn) {
        if (typeof name === 'object') {
            const tmp = name;
            name = tmp.name;
            opts = tmp.options;
            fn = tmp.action;
        }
        if (this.actionService === null) {
            return console.trace(`Tried to register a action without initializing @pm2/io`);
        }
        return this.actionService.registerAction(name, opts, fn);
    }
    onExit(callback) {
        if (typeof callback === 'function') {
            const onExit = require('signal-exit');
            return onExit(callback);
        }
    }
    emit(name, data) {
        const events = this.featureManager.get('events');
        return events.emit(name, data);
    }
    initModule(opts, cb) {
        if (!opts)
            opts = {};
        if (opts.reference) {
            opts.name = opts.reference;
            delete opts.reference;
        }
        opts = Object.assign({
            widget: {}
        }, opts);
        opts.widget = Object.assign({
            type: 'generic',
            logo: 'https://app.keymetrics.io/img/logo/keymetrics-300.png',
            theme: ['#111111', '#1B2228', '#807C7C', '#807C7C']
        }, opts.widget);
        opts.isModule = true;
        opts = configuration_1.default.init(opts);
        return typeof cb === 'function' ? cb(null, opts) : opts;
    }
    expressErrorHandler() {
        const notify = this.featureManager.get('notify');
        return notify.expressErrorHandler();
    }
    koaErrorHandler() {
        const notify = this.featureManager.get('notify');
        return notify.koaErrorHandler();
    }
}
exports.default = PMX;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG14LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3BteC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxZQUFZLENBQUE7OztBQUVaLG1EQUEyQztBQUMzQyxpQ0FBeUI7QUFDekIscURBQWlEO0FBQ2pELG9EQUFrRjtBQUNsRixxREFBaUQ7QUFDakQsZ0RBQWtEO0FBRWxELGdEQUF3SDtBQU94SCwyQ0FBNkM7QUFHN0MsMERBQTZEO0FBQzdELHNEQUFrRDtBQUVsRCxNQUFhLFFBQVE7SUFBckI7UUFJRSxvQkFBZSxHQUFhLElBQUksQ0FBQTtRQWNoQyxjQUFTLEdBQStCLElBQUksQ0FBQTtRQUs1QyxlQUFVLEdBQWEsS0FBSyxDQUFBO0lBSzlCLENBQUM7Q0FBQTtBQTVCRCw0QkE0QkM7QUFFWSxRQUFBLGFBQWEsR0FBYTtJQUNyQyxlQUFlLEVBQUUsSUFBSTtJQUNyQixTQUFTLEVBQUUsSUFBSTtJQUNmLE9BQU8sRUFBRTtRQUNQLEVBQUUsRUFBRSxJQUFJO1FBQ1IsT0FBTyxFQUFFLEtBQUs7UUFDZCxTQUFTLEVBQUUsSUFBSTtRQUNmLE9BQU8sRUFBRSxJQUFJO1FBQ2IsSUFBSSxFQUFFLElBQUk7S0FDWDtJQUNELFVBQVUsRUFBRSxLQUFLO0lBQ2pCLFVBQVUsRUFBRSxTQUFTO0NBQ3RCLENBQUE7QUFFRCxNQUFxQixHQUFHO0lBQXhCO1FBR1UsbUJBQWMsR0FBbUIsSUFBSSwrQkFBYyxFQUFFLENBQUE7UUFDckQsY0FBUyxHQUFxQixJQUFJLENBQUE7UUFDbEMsa0JBQWEsR0FBeUIsSUFBSSxDQUFBO1FBQzFDLGtCQUFhLEdBQXlCLElBQUksQ0FBQTtRQUMxQyx3QkFBbUIsR0FBK0IsSUFBSSxDQUFBO1FBQ3RELFdBQU0sR0FBYSxJQUFBLGVBQUssRUFBQyxVQUFVLENBQUMsQ0FBQTtRQUNwQyxnQkFBVyxHQUFZLEtBQUssQ0FBQTtRQUM3QixlQUFVLEdBQTBCLHVCQUFVLENBQUE7SUFxVnZELENBQUM7SUFoVkMs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