"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.canUseInspector = void 0;
const semver = require("semver");
exports.default = {
    METRIC_INTERVAL: 990
};
function canUseInspector() {
    const isAboveNode10 = semver.satisfies(process.version, '>= 10.1.0');
    const isAboveNode8 = semver.satisfies(process.version, '>= 8.0.0');
    const canUseInNode8 = process.env.FORCE_INSPECTOR === '1'
        || process.env.FORCE_INSPECTOR === 'true' || process.env.NODE_ENV === 'production';
    return isAboveNode10 || (isAboveNode8 && canUseInNode8);
}
exports.canUseInspector = canUseInspector;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uc3RhbnRzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2NvbnN0YW50cy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxpQ0FBZ0M7QUFFaEMsa0JBQWU7SUFDYixlQUFlLEVBQUUsR0FBRztDQUNyQixDQUFBO0FBRUQsU0FBZ0IsZUFBZTtJQUM3QixNQUFNLGFBQWEsR0FBRyxNQUFNLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsV0FBVyxDQUFDLENBQUE7SUFDcEUsTUFBTSxZQUFZLEdBQUcsTUFBTSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLFVBQVUsQ0FBQyxDQUFBO0lBQ2xFLE1BQU0sYUFBYSxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsZUFBZSxLQUFLLEdBQUc7V0FDcEQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxlQUFlLEtBQUssTUFBTSxJQUFJLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxLQUFLLFlBQVksQ0FBQTtJQUNwRixPQUFPLGFBQWEsSUFBSSxDQUFDLFlBQVksSUFBSSxhQUFhLENBQUMsQ0FBQTtBQUN6RCxDQUFDO0FBTkQsMENBTUMifQ==