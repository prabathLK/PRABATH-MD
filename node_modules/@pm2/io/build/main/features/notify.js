'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotifyFeature = exports.ErrorContext = exports.NotifyOptions = void 0;
const tslib_1 = require("tslib");
const configuration_1 = require("../configuration");
const serviceManager_1 = require("../serviceManager");
const debug_1 = require("debug");
const semver = require("semver");
const stackParser_1 = require("../utils/stackParser");
const fs = require("fs");
const path = require("path");
class NotifyOptions {
}
exports.NotifyOptions = NotifyOptions;
class ErrorContext {
}
exports.ErrorContext = ErrorContext;
const optionsDefault = {
    catchExceptions: true
};
class NotifyFeature {
    constructor() {
        this.logger = (0, debug_1.default)('axm:features:notify');
    }
    init(options) {
        if (options === undefined) {
            options = optionsDefault;
        }
        this.logger('init');
        this.transport = serviceManager_1.ServiceManager.get('transport');
        if (this.transport === undefined) {
            return this.logger(`Failed to load transporter service`);
        }
        configuration_1.default.configureModule({
            error: true
        });
        if (options.catchExceptions === false)
            return;
        this.logger('Registering hook to catch unhandled exception/rejection');
        this.cache = new stackParser_1.Cache({
            miss: (key) => {
                try {
                    const content = fs.readFileSync(path.resolve(key));
                    return content.toString().split(/\r?\n/);
                }
                catch (err) {
                    this.logger('Error while trying to get file from FS : %s', err.message || err);
                    return null;
                }
            },
            ttl: 30 * 60
        });
        this.stackParser = new stackParser_1.StackTraceParser({
            cache: this.cache,
            contextSize: 5
        });
        this.catchAll();
    }
    destroy() {
        process.removeListener('uncaughtException', this.onUncaughtException);
        process.removeListener('unhandledRejection', this.onUnhandledRejection);
        this.logger('destroy');
    }
    getSafeError(err) {
        if (err instanceof Error)
            return err;
        let message;
        try {
            message = `Non-error value: ${JSON.stringify(err)}`;
        }
        catch (e) {
            try {
                message = `Unserializable non-error value: ${String(e)}`;
            }
            catch (e2) {
                message = `Unserializable non-error value that cannot be converted to a string`;
            }
        }
        if (message.length > 1000)
            message = message.substr(0, 1000) + '...';
        return new Error(message);
    }
    notifyError(err, context) {
        if (typeof context !== 'object') {
            context = {};
        }
        if (this.transport === undefined) {
            return this.logger(`Tried to send error without having transporter available`);
        }
        const safeError = this.getSafeError(err);
        let stackContext = null;
        if (err instanceof Error) {
            stackContext = this.stackParser.retrieveContext(err);
        }
        const payload = Object.assign({
            message: safeError.message,
            stack: safeError.stack,
            name: safeError.name,
            metadata: context
        }, stackContext === null ? {} : stackContext);
        return this.transport.send('process:exception', payload);
    }
    onUncaughtException(error) {
        if (semver.satisfies(process.version, '< 6')) {
            console.error(error.stack);
        }
        else {
            console.error(error);
        }
        const safeError = this.getSafeError(error);
        let stackContext = null;
        if (error instanceof Error) {
            stackContext = this.stackParser.retrieveContext(error);
        }
        const payload = Object.assign({
            message: safeError.message,
            stack: safeError.stack,
            name: safeError.name
        }, stackContext === null ? {} : stackContext);
        if (serviceManager_1.ServiceManager.get('transport')) {
            serviceManager_1.ServiceManager.get('transport').send('process:exception', payload);
        }
        if (process.listeners('uncaughtException').length === 1) {
            process.exit(1);
        }
    }
    onUnhandledRejection(error) {
        if (error === undefined)
            return;
        console.error(error);
        const safeError = this.getSafeError(error);
        let stackContext = null;
        if (error instanceof Error) {
            stackContext = this.stackParser.retrieveContext(error);
        }
        const payload = Object.assign({
            message: safeError.message,
            stack: safeError.stack,
            name: safeError.name
        }, stackContext === null ? {} : stackContext);
        if (serviceManager_1.ServiceManager.get('transport')) {
            serviceManager_1.ServiceManager.get('transport').send('process:exception', payload);
        }
    }
    catchAll() {
        if (process.env.exec_mode === 'cluster_mode') {
            return false;
        }
        process.on('uncaughtException', this.onUncaughtException.bind(this));
        process.on('unhandledRejection', this.onUnhandledRejection.bind(this));
    }
    expressErrorHandler() {
        const self = this;
        configuration_1.default.configureModule({
            error: true
        });
        return function errorHandler(err, req, res, next) {
            const safeError = self.getSafeError(err);
            const payload = {
                message: safeError.message,
                stack: safeError.stack,
                name: safeError.name,
                metadata: {
                    http: {
                        url: req.url,
                        params: req.params,
                        method: req.method,
                        query: req.query,
                        body: req.body,
                        path: req.path,
                        route: req.route && req.route.path ? req.route.path : undefined
                    },
                    custom: {
                        user: typeof req.user === 'object' ? req.user.id : undefined
                    }
                }
            };
            if (serviceManager_1.ServiceManager.get('transport')) {
                serviceManager_1.ServiceManager.get('transport').send('process:exception', payload);
            }
            return next(err);
        };
    }
    koaErrorHandler() {
        const self = this;
        configuration_1.default.configureModule({
            error: true
        });
        return function (ctx, next) {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                try {
                    yield next();
                }
                catch (err) {
                    const safeError = self.getSafeError(err);
                    const payload = {
                        message: safeError.message,
                        stack: safeError.stack,
                        name: safeError.name,
                        metadata: {
                            http: {
                                url: ctx.request.url,
                                params: ctx.params,
                                method: ctx.request.method,
                                query: ctx.request.query,
                                body: ctx.request.body,
                                path: ctx.request.path,
                                route: ctx._matchedRoute
                            },
                            custom: {
                                user: typeof ctx.user === 'object' ? ctx.user.id : undefined
                            }
                        }
                    };
                    if (serviceManager_1.ServiceManager.get('transport')) {
                        serviceManager_1.ServiceManager.get('transport').send('process:exception', payload);
                    }
                    throw err;
                }
            });
        };
    }
}
exports.NotifyFeature = NotifyFeature;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm90aWZ5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2ZlYXR1cmVzL25vdGlmeS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxZQUFZLENBQUE7Ozs7QUFHWixvREFBNEM7QUFDNUMsc0RBQWtEO0FBQ2xELGlDQUF5QjtBQUV6QixpQ0FBZ0M7QUFDaEMsc0RBQTRFO0FBQzVFLHlCQUF3QjtBQUN4Qiw2QkFBNEI7QUFFNUIsTUFBYSxhQUFhO0NBRXpCO0FBRkQsc0NBRUM7QUFFRCxNQUFhLFlBQVk7Q0FVeEI7QUFWRCxvQ0FVQztBQUVELE1BQU0sY0FBYyxHQUFrQjtJQUNwQyxlQUFlLEVBQUUsSUFBSTtDQUN0QixDQUFBO0FBRUQsTUFBYSxhQUFhO0lBQTFCO1FBRVUsV0FBTSxHQUFhLElBQUEsZUFBSyxFQUFDLHFCQUFxQixDQUFDLENBQUE7SUFxT3pELENBQUM7SUFoT0MsSUFBSSxDQUFFLE9BQXVCO1FBQzNCLElBQUksT0FBTyxLQUFLLFNBQVMsRUFBRSxDQUFDO1lBQzFCLE9BQU8sR0FBRyxjQUFjLENBQUE7UUFDMUIsQ0FBQztRQUNELElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUE7UUFDbkIsSUFBSSxDQUFDLFNBQVMsR0FBRywrQkFBYyxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsQ0FBQTtRQUNoRCxJQUFJLElBQUksQ0FBQyxTQUFTLEtBQUssU0FBUyxFQUFFLENBQUM7WUFDakMsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLG9DQUFvQyxDQUFDLENBQUE7UUFDMUQsQ0FBQztRQUVELHVCQUFhLENBQUMsZUFBZSxDQUFDO1lBQzVCLEtBQUssRUFBRyxJQUFJO1NBQ2IsQ0FBQyxDQUFBO1FBQ0YsSUFBSSxPQUFPLENBQUMsZUFBZSxLQUFLLEtBQUs7WUFBRSxPQUFNO1FBQzdDLElBQUksQ0FBQyxNQUFNLENBQUMseURBQXlELENBQUMsQ0FBQTtRQUN0RSxJQUFJLENBQUMsS0FBSyxHQUFH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