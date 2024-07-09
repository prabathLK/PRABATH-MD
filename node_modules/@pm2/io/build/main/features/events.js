"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventsFeature = void 0;
const serviceManager_1 = require("../serviceManager");
const Debug = require("debug");
class EventsFeature {
    constructor() {
        this.logger = Debug('axm:features:events');
    }
    init() {
        this.transport = serviceManager_1.ServiceManager.get('transport');
        this.logger('init');
    }
    emit(name, data) {
        if (typeof name !== 'string') {
            console.error('event name must be a string');
            return console.trace();
        }
        if (typeof data !== 'object') {
            console.error('event data must be an object');
            return console.trace();
        }
        if (data instanceof Array) {
            console.error(`event data cannot be an array`);
            return console.trace();
        }
        let inflightObj = {};
        try {
            inflightObj = JSON.parse(JSON.stringify(data));
        }
        catch (err) {
            return console.log('Failed to serialize the event data', err.message);
        }
        inflightObj.__name = name;
        if (this.transport === undefined) {
            return this.logger('Failed to send event as transporter isnt available');
        }
        this.transport.send('human:event', inflightObj);
    }
    destroy() {
        this.logger('destroy');
    }
}
exports.EventsFeature = EventsFeature;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXZlbnRzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2ZlYXR1cmVzL2V2ZW50cy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxzREFBa0Q7QUFHbEQsK0JBQThCO0FBRTlCLE1BQWEsYUFBYTtJQUExQjtRQUdVLFdBQU0sR0FBYSxLQUFLLENBQUMscUJBQXFCLENBQUMsQ0FBQTtJQXNDekQsQ0FBQztJQXBDQyxJQUFJO1FBQ0YsSUFBSSxDQUFDLFNBQVMsR0FBRywrQkFBYyxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsQ0FBQTtRQUNoRCxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFBO0lBQ3JCLENBQUM7SUFFRCxJQUFJLENBQUUsSUFBYSxFQUFFLElBQVU7UUFDN0IsSUFBSSxPQUFPLElBQUksS0FBSyxRQUFRLEVBQUUsQ0FBQztZQUM3QixPQUFPLENBQUMsS0FBSyxDQUFDLDZCQUE2QixDQUFDLENBQUE7WUFDNUMsT0FBTyxPQUFPLENBQUMsS0FBSyxFQUFFLENBQUE7UUFDeEIsQ0FBQztRQUNELElBQUksT0FBTyxJQUFJLEtBQUssUUFBUSxFQUFFLENBQUM7WUFDN0IsT0FBTyxDQUFDLEtBQUssQ0FBQyw4QkFBOEIsQ0FBQyxDQUFBO1lBQzdDLE9BQU8sT0FBTyxDQUFDLEtBQUssRUFBRSxDQUFBO1FBQ3hCLENBQUM7UUFDRCxJQUFJLElBQUksWUFBWSxLQUFLLEVBQUUsQ0FBQztZQUMxQixPQUFPLENBQUMsS0FBSyxDQUFDLCtCQUErQixDQUFDLENBQUE7WUFDOUMsT0FBTyxPQUFPLENBQUMsS0FBSyxFQUFFLENBQUE7UUFDeEIsQ0FBQztRQUVELElBQUksV0FBVyxHQUFpQixFQUFFLENBQUE7UUFDbEMsSUFBSSxDQUFDO1lBQ0gsV0FBVyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFBO1FBQ2hELENBQUM7UUFBQyxPQUFPLEdBQUcsRUFBRSxDQUFDO1lBQ2IsT0FBTyxPQUFPLENBQUMsR0FBRyxDQUFDLG9DQUFvQyxFQUFFLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQTtRQUN2RSxDQUFDO1FBRUQsV0FBVyxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUE7UUFDekIsSUFBSSxJQUFJLENBQUMsU0FBUyxLQUFLLFNBQVMsRUFBRSxDQUFDO1lBQ2pDLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxvREFBb0QsQ0FBQyxDQUFBO1FBQzFFLENBQUM7UUFDRCxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUUsV0FBVyxDQUFDLENBQUE7SUFDakQsQ0FBQztJQUVELE9BQU87UUFDTCxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFBO0lBQ3hCLENBQUM7Q0FDRjtBQXpDRCxzQ0F5Q0MifQ==