"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfilingFeature = exports.ProfilingConfig = void 0;
const addonProfiler_1 = require("../profilers/addonProfiler");
const inspectorProfiler_1 = require("../profilers/inspectorProfiler");
const constants_1 = require("../constants");
const Debug = require("debug");
class ProfilingConfig {
}
exports.ProfilingConfig = ProfilingConfig;
const defaultProfilingConfig = {
    cpuJS: true,
    heapSnapshot: true,
    heapSampling: true,
    implementation: 'both'
};
const disabledProfilingConfig = {
    cpuJS: false,
    heapSnapshot: false,
    heapSampling: false,
    implementation: 'none'
};
class ProfilingFeature {
    constructor() {
        this.logger = Debug('axm:features:profiling');
    }
    init(config) {
        if (config === true) {
            config = defaultProfilingConfig;
        }
        else if (config === false) {
            config = disabledProfilingConfig;
        }
        else if (config === undefined) {
            config = defaultProfilingConfig;
        }
        if (process.env.PM2_PROFILING_FORCE_FALLBACK === 'true') {
            config.implementation = 'addon';
        }
        if (config.implementation === undefined || config.implementation === 'both') {
            config.implementation = (0, constants_1.canUseInspector)() === true ? 'inspector' : 'addon';
        }
        switch (config.implementation) {
            case 'inspector': {
                this.logger('using inspector implementation');
                this.profiler = new inspectorProfiler_1.default();
                break;
            }
            case 'addon': {
                this.logger('using addon implementation');
                this.profiler = new addonProfiler_1.default();
                break;
            }
            default: {
                return this.logger(`Invalid profiler implementation choosen: ${config.implementation}`);
            }
        }
        this.logger('init');
        this.profiler.init();
    }
    destroy() {
        this.logger('destroy');
        if (this.profiler === undefined)
            return;
        this.profiler.destroy();
    }
}
exports.ProfilingFeature = ProfilingFeature;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvZmlsaW5nLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2ZlYXR1cmVzL3Byb2ZpbGluZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSw4REFBc0Q7QUFDdEQsc0VBQThEO0FBQzlELDRDQUE4QztBQUM5QywrQkFBOEI7QUFROUIsTUFBYSxlQUFlO0NBSzNCO0FBTEQsMENBS0M7QUFFRCxNQUFNLHNCQUFzQixHQUFvQjtJQUM5QyxLQUFLLEVBQUUsSUFBSTtJQUNYLFlBQVksRUFBRSxJQUFJO0lBQ2xCLFlBQVksRUFBRSxJQUFJO0lBQ2xCLGNBQWMsRUFBRSxNQUFNO0NBQ3ZCLENBQUE7QUFFRCxNQUFNLHVCQUF1QixHQUFvQjtJQUMvQyxLQUFLLEVBQUUsS0FBSztJQUNaLFlBQVksRUFBRSxLQUFLO0lBQ25CLFlBQVksRUFBRSxLQUFLO0lBQ25CLGNBQWMsRUFBRSxNQUFNO0NBQ3ZCLENBQUE7QUFFRCxNQUFhLGdCQUFnQjtJQUE3QjtRQUdVLFdBQU0sR0FBYSxLQUFLLENBQUMsd0JBQXdCLENBQUMsQ0FBQTtJQTRDNUQsQ0FBQztJQTFDQyxJQUFJLENBQUUsTUFBa0M7UUFDdEMsSUFBSSxNQUFNLEtBQUssSUFBSSxFQUFFLENBQUM7WUFDcEIsTUFBTSxHQUFHLHNCQUFzQixDQUFBO1FBQ2pDLENBQUM7YUFBTSxJQUFJLE1BQU0sS0FBSyxLQUFLLEVBQUUsQ0FBQztZQUM1QixNQUFNLEdBQUcsdUJBQXVCLENBQUE7UUFDbEMsQ0FBQzthQUFNLElBQUksTUFBTSxLQUFLLFNBQVMsRUFBRSxDQUFDO1lBQ2hDLE1BQU0sR0FBRyxzQkFBc0IsQ0FBQTtRQUNqQyxDQUFDO1FBR0QsSUFBSSxPQUFPLENBQUMsR0FBRyxDQUFDLDRCQUE0QixLQUFLLE1BQU0sRUFBRSxDQUFDO1lBQ3hELE1BQU0sQ0FBQyxjQUFjLEdBQUcsT0FBTyxDQUFBO1FBQ2pDLENBQUM7UUFFRCxJQUFJLE1BQU0sQ0FBQyxjQUFjLEtBQUssU0FBUyxJQUFJLE1BQU0sQ0FBQyxjQUFjLEtBQUssTUFBTSxFQUFFLENBQUM7WUFDNUUsTUFBTSxDQUFDLGNBQWMsR0FBRyxJQUFBLDJCQUFlLEdBQUUsS0FBSyxJQUFJLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFBO1FBQzVFLENBQUM7UUFFRCxRQUFRLE1BQU0sQ0FBQyxjQUFjLEVBQUUsQ0FBQztZQUM5QixLQUFLLFdBQVcsQ0FBQyxDQUFDLENBQUM7Z0JBQ2pCLElBQUksQ0FBQyxNQUFNLENBQUMsZ0NBQWdDLENBQUMsQ0FBQTtnQkFDN0MsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLDJCQUFpQixFQUFFLENBQUE7Z0JBQ3ZDLE1BQUs7WUFDUCxDQUFDO1lBQ0QsS0FBSyxPQUFPLENBQUMsQ0FBQyxDQUFDO2dCQUNiLElBQUksQ0FBQyxNQUFNLENBQUMsNEJBQTRCLENBQUMsQ0FBQTtnQkFDekMsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLHVCQUFhLEVBQUUsQ0FBQTtnQkFDbkMsTUFBSztZQUNQLENBQUM7WUFDRCxPQUFPLENBQUMsQ0FBQyxDQUFDO2dCQUNSLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyw0Q0FBNEMsTUFBTSxDQUFDLGNBQWMsRUFBRSxDQUFDLENBQUE7WUFDekYsQ0FBQztRQUNILENBQUM7UUFDRCxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFBO1FBQ25CLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLENBQUE7SUFDdEIsQ0FBQztJQUVELE9BQU87UUFDTCxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFBO1FBQ3RCLElBQUksSUFBSSxDQUFDLFFBQVEsS0FBSyxTQUFTO1lBQUUsT0FBTTtRQUN2QyxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sRUFBRSxDQUFBO0lBQ3pCLENBQUM7Q0FDRjtBQS9DRCw0Q0ErQ0MifQ==