"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTransport = exports.TransportConfig = void 0;
const IPCTransport_1 = require("../transports/IPCTransport");
class TransportConfig {
}
exports.TransportConfig = TransportConfig;
function createTransport(name, config) {
    const transport = new IPCTransport_1.IPCTransport();
    transport.init(config);
    return transport;
}
exports.createTransport = createTransport;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNwb3J0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3NlcnZpY2VzL3RyYW5zcG9ydC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFHQSw2REFBeUQ7QUFJekQsTUFBYSxlQUFlO0NBMEMzQjtBQTFDRCwwQ0EwQ0M7QUFnQ0QsU0FBZ0IsZUFBZSxDQUFFLElBQVksRUFBRSxNQUF1QjtJQUNwRSxNQUFNLFNBQVMsR0FBRyxJQUFJLDJCQUFZLEVBQUUsQ0FBQTtJQUNwQyxTQUFTLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFBO0lBQ3RCLE9BQU8sU0FBUyxDQUFBO0FBZWxCLENBQUM7QUFsQkQsMENBa0JDIn0=