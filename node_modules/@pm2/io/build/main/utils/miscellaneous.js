"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const serviceManager_1 = require("../serviceManager");
class MiscUtils {
    static generateUUID() {
        return Math.random().toString(36).substr(2, 16);
    }
    static getValueFromDump(property, parentProperty) {
        if (!parentProperty) {
            parentProperty = 'handles';
        }
        const dump = serviceManager_1.ServiceManager.get('eventLoopService').inspector.dump();
        return dump[parentProperty].hasOwnProperty(property) ? dump[parentProperty][property].length : 0;
    }
}
exports.default = MiscUtils;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWlzY2VsbGFuZW91cy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy91dGlscy9taXNjZWxsYW5lb3VzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsc0RBQWtEO0FBRWxELE1BQXFCLFNBQVM7SUFDNUIsTUFBTSxDQUFDLFlBQVk7UUFDakIsT0FBTyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUE7SUFDakQsQ0FBQztJQUVELE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBRSxRQUFRLEVBQUUsY0FBZTtRQUNoRCxJQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7WUFDcEIsY0FBYyxHQUFHLFNBQVMsQ0FBQTtRQUM1QixDQUFDO1FBQ0QsTUFBTSxJQUFJLEdBQUcsK0JBQWMsQ0FBQyxHQUFHLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLENBQUE7UUFDcEUsT0FBTyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsY0FBYyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7SUFDbEcsQ0FBQztDQUNGO0FBWkQsNEJBWUMifQ==