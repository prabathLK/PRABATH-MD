'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.RuntimeStatsService = void 0;
const debug_1 = require("debug");
const module_1 = require("../utils/module");
const eventemitter2_1 = require("eventemitter2");
class RuntimeStatsService extends eventemitter2_1.EventEmitter2 {
    constructor() {
        super(...arguments);
        this.logger = (0, debug_1.default)('axm:services:runtimeStats');
        this.enabled = false;
    }
    init() {
        this.logger('init');
        if (process.env.PM2_APM_DISABLE_RUNTIME_STATS === 'true') {
            return this.logger('disabling service because of the environment flag');
        }
        const modulePath = module_1.default.detectModule('@pm2/node-runtime-stats');
        if (typeof modulePath !== 'string')
            return;
        const RuntimeStats = module_1.default.loadModule(modulePath);
        if (RuntimeStats instanceof Error) {
            return this.logger(`Failed to require module @pm2/node-runtime-stats: ${RuntimeStats.message}`);
        }
        this.noduleInstance = new RuntimeStats({
            delay: 1000
        });
        this.logger('starting runtime stats');
        this.noduleInstance.start();
        this.handle = (data) => {
            this.logger('received runtime stats', data);
            this.emit('data', data);
        };
        this.noduleInstance.on('sense', this.handle);
        this.enabled = true;
    }
    isEnabled() {
        return this.enabled;
    }
    destroy() {
        if (this.noduleInstance !== undefined && this.noduleInstance !== null) {
            this.logger('removing listener on runtime stats service');
            this.noduleInstance.removeListener('sense', this.handle);
            this.noduleInstance.stop();
        }
        this.logger('destroy');
    }
}
exports.RuntimeStatsService = RuntimeStatsService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicnVudGltZVN0YXRzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3NlcnZpY2VzL3J1bnRpbWVTdGF0cy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxZQUFZLENBQUE7OztBQUVaLGlDQUF5QjtBQUN6Qiw0Q0FBbUM7QUFDbkMsaURBQTZDO0FBRTdDLE1BQWEsbUJBQW9CLFNBQVEsNkJBQWE7SUFBdEQ7O1FBRVUsV0FBTSxHQUFRLElBQUEsZUFBSyxFQUFDLDJCQUEyQixDQUFDLENBQUE7UUFHaEQsWUFBTyxHQUFZLEtBQUssQ0FBQTtJQTZDbEMsQ0FBQztJQTNDQyxJQUFJO1FBQ0YsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQTtRQUNuQixJQUFJLE9BQU8sQ0FBQyxHQUFHLENBQUMsNkJBQTZCLEtBQUssTUFBTSxFQUFFLENBQUM7WUFDekQsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLG1EQUFtRCxDQUFDLENBQUE7UUFDekUsQ0FBQztRQUVELE1BQU0sVUFBVSxHQUFHLGdCQUFLLENBQUMsWUFBWSxDQUFDLHlCQUF5QixDQUFDLENBQUE7UUFDaEUsSUFBSSxPQUFPLFVBQVUsS0FBSyxRQUFRO1lBQUUsT0FBTTtRQUUxQyxNQUFNLFlBQVksR0FBRyxnQkFBSyxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUMsQ0FBQTtRQUNqRCxJQUFJLFlBQVksWUFBWSxLQUFLLEVBQUUsQ0FBQztZQUNsQyxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMscURBQXFELFlBQVksQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFBO1FBQ2pHLENBQUM7UUFDRCxJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksWUFBWSxDQUFDO1lBQ3JDLEtBQUssRUFBRSxJQUFJO1NBQ1osQ0FBQyxDQUFBO1FBQ0YsSUFBSSxDQUFDLE1BQU0sQ0FBQyx3QkFBd0IsQ0FBQyxDQUFBO1FBQ3JDLElBQUksQ0FBQyxjQUFjLENBQUMsS0FBSyxFQUFFLENBQUE7UUFDM0IsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLElBQUksRUFBRSxFQUFFO1lBQ3JCLElBQUksQ0FBQyxNQUFNLENBQUMsd0JBQXdCLEVBQUUsSUFBSSxDQUFDLENBQUE7WUFDM0MsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLENBQUE7UUFDekIsQ0FBQyxDQUFBO1FBR0QsSUFBSSxDQUFDLGNBQWMsQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQTtRQUM1QyxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQTtJQUNyQixDQUFDO0lBS0QsU0FBUztRQUNQLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQTtJQUNyQixDQUFDO0lBRUQsT0FBTztRQUNMLElBQUksSUFBSSxDQUFDLGNBQWMsS0FBSyxTQUFTLElBQUksSUFBSSxDQUFDLGNBQWMsS0FBSyxJQUFJLEVBQUUsQ0FBQztZQUN0RSxJQUFJLENBQUMsTUFBTSxDQUFDLDRDQUE0QyxDQUFDLENBQUE7WUFDekQsSUFBSSxDQUFDLGNBQWMsQ0FBQyxjQUFjLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQTtZQUN4RCxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxDQUFBO1FBQzVCLENBQUM7UUFDRCxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFBO0lBQ3hCLENBQUM7Q0FDRjtBQWxERCxrREFrREMifQ==