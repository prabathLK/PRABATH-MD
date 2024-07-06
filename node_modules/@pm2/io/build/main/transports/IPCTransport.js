"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IPCTransport = void 0;
const Debug = require("debug");
const eventemitter2_1 = require("eventemitter2");
const cluster = require("cluster");
class IPCTransport extends eventemitter2_1.EventEmitter2 {
    constructor() {
        super(...arguments);
        this.initiated = false;
        this.logger = Debug('axm:transport:ipc');
    }
    init(config) {
        this.logger('Init new transport service');
        if (this.initiated === true) {
            console.error(`Trying to re-init the transport, please avoid`);
            return this;
        }
        this.initiated = true;
        this.logger('Agent launched');
        this.onMessage = (data) => {
            this.logger(`Received reverse message from IPC`);
            this.emit('data', data);
        };
        process.on('message', this.onMessage);
        if (cluster.isWorker === false) {
            this.autoExitHook();
        }
        return this;
    }
    autoExitHook() {
        this.autoExitHandle = setInterval(() => {
            let currentProcess = (cluster.isWorker) ? cluster.worker.process : process;
            if (currentProcess._getActiveHandles().length === 3) {
                let handlers = currentProcess._getActiveHandles().map(h => h.constructor.name);
                if (handlers.includes('Pipe') === true &&
                    handlers.includes('Socket') === true) {
                    process.removeListener('message', this.onMessage);
                    let tmp = setTimeout(_ => {
                        this.logger(`Still alive, listen back to IPC`);
                        process.on('message', this.onMessage);
                    }, 200);
                    tmp.unref();
                }
            }
        }, 3000);
        this.autoExitHandle.unref();
    }
    setMetrics(metrics) {
        const serializedMetric = metrics.reduce((object, metric) => {
            if (typeof metric.name !== 'string')
                return object;
            object[metric.name] = {
                historic: metric.historic,
                unit: metric.unit,
                type: metric.id,
                value: metric.value
            };
            return object;
        }, {});
        this.send('axm:monitor', serializedMetric);
    }
    addAction(action) {
        this.logger(`Add action: ${action.name}:${action.type}`);
        this.send('axm:action', {
            action_name: action.name,
            action_type: action.type,
            arity: action.arity,
            opts: action.opts
        });
    }
    setOptions(options) {
        this.logger(`Set options: [${Object.keys(options).join(',')}]`);
        return this.send('axm:option:configuration', options);
    }
    send(channel, payload) {
        if (typeof process.send !== 'function')
            return -1;
        if (process.connected === false) {
            console.error('Process disconnected from parent! (not connected)');
            return process.exit(1);
        }
        try {
            process.send({ type: channel, data: payload });
        }
        catch (err) {
            this.logger('Process disconnected from parent !');
            this.logger(err);
            return process.exit(1);
        }
    }
    destroy() {
        if (this.onMessage !== undefined) {
            process.removeListener('message', this.onMessage);
        }
        if (this.autoExitHandle !== undefined) {
            clearInterval(this.autoExitHandle);
        }
        this.logger('destroy');
    }
}
exports.IPCTransport = IPCTransport;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSVBDVHJhbnNwb3J0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3RyYW5zcG9ydHMvSVBDVHJhbnNwb3J0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLCtCQUE4QjtBQUc5QixpREFBNkM7QUFDN0MsbUNBQWtDO0FBRWxDLE1BQWEsWUFBYSxTQUFRLDZCQUFhO0lBQS9DOztRQUVVLGNBQVMsR0FBWSxLQUFLLENBQUE7UUFDMUIsV0FBTSxHQUFhLEtBQUssQ0FBQyxtQkFBbUIsQ0FBQyxDQUFBO0lBd0d2RCxDQUFDO0lBcEdDLElBQUksQ0FBRSxNQUF3QjtRQUM1QixJQUFJLENBQUMsTUFBTSxDQUFDLDRCQUE0QixDQUFDLENBQUE7UUFDekMsSUFBSSxJQUFJLENBQUMsU0FBUyxLQUFLLElBQUksRUFBRSxDQUFDO1lBQzVCLE9BQU8sQ0FBQyxLQUFLLENBQUMsK0NBQStDLENBQUMsQ0FBQTtZQUM5RCxPQUFPLElBQUksQ0FBQTtRQUNiLENBQUM7UUFDRCxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQTtRQUNyQixJQUFJLENBQUMsTUFBTSxDQUFDLGdCQUFnQixDQUFDLENBQUE7UUFDN0IsSUFBSSxDQUFDLFNBQVMsR0FBRyxDQUFDLElBQWEsRUFBRSxFQUFFO1lBQ2pDLElBQUksQ0FBQyxNQUFNLENBQUMsbUNBQW1DLENBQUMsQ0FBQTtZQUNoRCxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsQ0FBQTtRQUN6QixDQUFDLENBQUE7UUFDRCxPQUFPLENBQUMsRUFBRSxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUE7UUFJckMsSUFBSSxPQUFPLENBQUMsUUFBUSxLQUFLLEtBQUssRUFBRSxDQUFDO1lBQy9CLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQTtRQUNyQixDQUFDO1FBQ0QsT0FBTyxJQUFJLENBQUE7SUFDYixDQUFDO0lBRU8sWUFBWTtRQUdsQixJ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