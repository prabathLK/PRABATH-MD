"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeatureConfig = exports.FeatureManager = exports.getObjectAtPath = void 0;
const notify_1 = require("./features/notify");
const profiling_1 = require("./features/profiling");
const events_1 = require("./features/events");
const metrics_1 = require("./features/metrics");
const dependencies_1 = require("./features/dependencies");
const Debug = require("debug");
function getObjectAtPath(context, path) {
    if (path.indexOf('.') === -1 && path.indexOf('[') === -1) {
        return context[path];
    }
    let crumbs = path.split(/\.|\[|\]/g);
    let i = -1;
    let len = crumbs.length;
    let result;
    while (++i < len) {
        if (i === 0)
            result = context;
        if (!crumbs[i])
            continue;
        if (result === undefined)
            break;
        result = result[crumbs[i]];
    }
    return result;
}
exports.getObjectAtPath = getObjectAtPath;
class AvailableFeature {
}
const availablesFeatures = [
    {
        name: 'notify',
        optionsPath: '.',
        module: notify_1.NotifyFeature
    },
    {
        name: 'profiler',
        optionsPath: 'profiling',
        module: profiling_1.ProfilingFeature
    },
    {
        name: 'events',
        module: events_1.EventsFeature
    },
    {
        name: 'metrics',
        optionsPath: 'metrics',
        module: metrics_1.MetricsFeature
    },
    {
        name: 'dependencies',
        module: dependencies_1.DependenciesFeature
    }
];
class FeatureManager {
    constructor() {
        this.logger = Debug('axm:features');
    }
    init(options) {
        for (let availableFeature of availablesFeatures) {
            this.logger(`Creating feature ${availableFeature.name}`);
            const feature = new availableFeature.module();
            let config = undefined;
            if (typeof availableFeature.optionsPath !== 'string') {
                config = {};
            }
            else if (availableFeature.optionsPath === '.') {
                config = options;
            }
            else {
                config = getObjectAtPath(options, availableFeature.optionsPath);
            }
            this.logger(`Init feature ${availableFeature.name}`);
            feature.init(config);
            availableFeature.instance = feature;
        }
    }
    get(name) {
        const feature = availablesFeatures.find(feature => feature.name === name);
        if (feature === undefined || feature.instance === undefined) {
            throw new Error(`Tried to call feature ${name} which doesn't exist or wasn't initiated`);
        }
        return feature.instance;
    }
    destroy() {
        for (let availableFeature of availablesFeatures) {
            if (availableFeature.instance === undefined)
                continue;
            this.logger(`Destroy feature ${availableFeature.name}`);
            availableFeature.instance.destroy();
        }
    }
}
exports.FeatureManager = FeatureManager;
class FeatureConfig {
}
exports.FeatureConfig = FeatureConfig;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmVhdHVyZU1hbmFnZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvZmVhdHVyZU1hbmFnZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQ0EsOENBQWlEO0FBQ2pELG9EQUF1RDtBQUN2RCw4Q0FBaUQ7QUFFakQsZ0RBQW1EO0FBQ25ELDBEQUE2RDtBQUM3RCwrQkFBOEI7QUFFOUIsU0FBZ0IsZUFBZSxDQUFFLE9BQWUsRUFBRSxJQUFZO0lBQzVELElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUM7UUFDekQsT0FBTyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUE7SUFDdEIsQ0FBQztJQUVELElBQUksTUFBTSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLENBQUE7SUFDcEMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUE7SUFDVixJQUFJLEdBQUcsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFBO0lBQ3ZCLElBQUksTUFBTSxDQUFBO0lBRVYsT0FBTyxFQUFFLENBQUMsR0FBRyxHQUFHLEVBQUUsQ0FBQztRQUNqQixJQUFJLENBQUMsS0FBSyxDQUFDO1lBQUUsTUFBTSxHQUFHLE9BQU8sQ0FBQTtRQUM3QixJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUFFLFNBQVE7UUFDeEIsSUFBSSxNQUFNLEtBQUssU0FBUztZQUFFLE1BQUs7UUFDL0IsTUFBTSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtJQUM1QixDQUFDO0lBRUQsT0FBTyxNQUFNLENBQUE7QUFDZixDQUFDO0FBbEJELDBDQWtCQztBQUVELE1BQU0sZ0JBQWdCO0NBcUJyQjtBQUVELE1BQU0sa0JBQWtCLEdBQXVCO0lBQzdDO1FBQ0UsSUFBSSxF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