"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActionService = exports.Action = void 0;
const serviceManager_1 = require("../serviceManager");
const Debug = require("debug");
class Action {
}
exports.Action = Action;
class ActionService {
    constructor() {
        this.timer = undefined;
        this.transport = undefined;
        this.actions = new Map();
        this.logger = Debug('axm:services:actions');
    }
    listener(data) {
        this.logger(`Received new message from reverse`);
        if (!data)
            return false;
        const actionName = data.msg ? data.msg : data.action_name ? data.action_name : data;
        let action = this.actions.get(actionName);
        if (typeof action !== 'object') {
            return this.logger(`Received action ${actionName} but failed to find the implementation`);
        }
        if (!action.isScoped) {
            this.logger(`Succesfully called custom action ${action.name} with arity ${action.handler.length}`);
            if (action.handler.length === 2) {
                let params = {};
                if (typeof data === 'object') {
                    params = data.opts;
                }
                return action.handler(params, action.callback);
            }
            return action.handler(action.callback);
        }
        if (data.uuid === undefined) {
            return this.logger(`Received scoped action ${action.name} but without uuid`);
        }
        const stream = {
            send: (dt) => {
                this.transport.send('axm:scoped_action:stream', {
                    data: dt,
                    uuid: data.uuid,
                    action_name: actionName
                });
            },
            error: (dt) => {
                this.transport.send('axm:scoped_action:error', {
                    data: dt,
                    uuid: data.uuid,
                    action_name: actionName
                });
            },
            end: (dt) => {
                this.transport.send('axm:scoped_action:end', {
                    data: dt,
                    uuid: data.uuid,
                    action_name: actionName
                });
            }
        };
        this.logger(`Succesfully called scoped action ${action.name}`);
        return action.handler(data.opts || {}, stream);
    }
    init() {
        this.transport = serviceManager_1.ServiceManager.get('transport');
        if (this.transport === undefined) {
            return this.logger(`Failed to load transport service`);
        }
        this.actions.clear();
        this.transport.on('data', this.listener.bind(this));
    }
    destroy() {
        if (this.timer !== undefined) {
            clearInterval(this.timer);
        }
        if (this.transport !== undefined) {
            this.transport.removeListener('data', this.listener.bind(this));
        }
    }
    registerAction(actionName, opts, handler) {
        if (typeof opts === 'function') {
            handler = opts;
            opts = undefined;
        }
        if (typeof actionName !== 'string') {
            console.error(`You must define an name when registering an action`);
            return;
        }
        if (typeof handler !== 'function') {
            console.error(`You must define an callback when registering an action`);
            return;
        }
        if (this.transport === undefined) {
            return this.logger(`Failed to load transport service`);
        }
        let type = 'custom';
        if (actionName.indexOf('km:') === 0 || actionName.indexOf('internal:') === 0) {
            type = 'internal';
        }
        const reply = (data) => {
            this.transport.send('axm:reply', {
                at: new Date().getTime(),
                action_name: actionName,
                return: data
            });
        };
        const action = {
            name: actionName,
            callback: reply,
            handler,
            type,
            isScoped: false,
            arity: handler.length,
            opts
        };
        this.logger(`Succesfully registered custom action ${action.name}`);
        this.actions.set(actionName, action);
        this.transport.addAction(action);
    }
    scopedAction(actionName, handler) {
        if (typeof actionName !== 'string') {
            console.error(`You must define an name when registering an action`);
            return -1;
        }
        if (typeof handler !== 'function') {
            console.error(`You must define an callback when registering an action`);
            return -1;
        }
        if (this.transport === undefined) {
            return this.logger(`Failed to load transport service`);
        }
        const action = {
            name: actionName,
            handler,
            type: 'scoped',
            isScoped: true,
            arity: handler.length,
            opts: null
        };
        this.logger(`Succesfully registered scoped action ${action.name}`);
        this.actions.set(actionName, action);
        this.transport.addAction(action);
    }
}
exports.ActionService = ActionService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWN0aW9ucy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9zZXJ2aWNlcy9hY3Rpb25zLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHNEQUFrRDtBQUVsRCwrQkFBOEI7QUFFOUIsTUFBYSxNQUFNO0NBUWxCO0FBUkQsd0JBUUM7QUFFRCxNQUFhLGFBQWE7SUFBMUI7UUFFVSxVQUFLLEdBQTZCLFNBQVMsQ0FBQTtRQUMzQyxjQUFTLEdBQTBCLFNBQVMsQ0FBQTtRQUM1QyxZQUFPLEdBQXdCLElBQUksR0FBRyxFQUFrQixDQUFBO1FBQ3hELFdBQU0sR0FBYSxLQUFLLENBQUMsc0JBQXNCLENBQUMsQ0FBQTtJQWlLMUQsQ0FBQztJQS9KUyxRQUFRLENBQUUsSUFBSTtRQUNwQixJQUFJLENBQUMsTUFBTSxDQUFDLG1DQUFtQyxDQUFDLENBQUE7UUFDaEQsSUFBSSxDQUFDLElBQUk7WUFBRSxPQUFPLEtBQUssQ0FBQTtRQUV2QixNQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUE7UUFDbkYsSUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUE7UUFDekMsSUFBSSxPQUFPLE1BQU0sS0FBSyxRQUFRLEVBQUUsQ0FBQztZQUMvQixPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsbUJBQW1CLFVBQVUsd0NBQXdDLENBQUMsQ0FBQTtRQUMzRixDQUFDO1FBR0QsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUUsQ0FBQztZQUNyQixJQUFJLENBQUMsTUFBTSxDQUFDLG9DQUFvQyxNQUFNLENBQUMsSUFBSSxlQUFlLE1BQU0sQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQTtZQUVsRyxJQUFJLE1BQU0sQ0FBQyxPQUFPLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRSxDQUFDO2dCQUNoQyxJQUFJLE1BQU0sR0FBRyxFQUFFLENBQUE7Z0JBQ2YsSUFBSSxPQUFPLElBQUksS0FBSyxRQUFRLEVBQUUsQ0FBQztvQkFDN0IsTUFBTSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUE7Z0JBQ3BCLENBQUM7Z0JBQ0QsT0FBTyxNQUFNLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUE7WUFDaEQsQ0FBQztZQUNELE9BQU8sTUFBTSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUE7UUFDeEMsQ0FBQztRQUdELElBQUksSUFBSSxDQUFDLElBQUksS0FBSyxTQUFTLEVBQUUsQ0FBQztZQUM1QixPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsMEJBQTBCLE1BQU0sQ0FBQyxJQUFJLG1CQUFtQixDQUFDLENBQUE7UUFDOUUsQ0FBQztRQUdELE1BQU0sTUFBTSxHQUFHO1lBQ2IsSUFBSSxFQUFHLENBQUMsRUFBRSxFQUFFLEVBQUU7Z0JBRVosSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsMEJBQTBCLEVBQUU7b0JBQzlDLElBQUksRUFBRSxFQUFFO29CQUNSLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSTtvQkFDZixXQUFXLEVBQUUsVUFBVTtpQkFDeEIsQ0FBQyxDQUFBO1lBQ0osQ0FBQztZQUNELEtBQUssRUFBRyxDQUFDLEVBQUUsRUFBRSxFQUFFO2dCQUViLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLHlCQUF5QixFQUFFO29CQUM3QyxJQUFJLEVBQUUsRUFBRTtvQkFDUixJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUk7b0JBQ2YsV0FBVyxFQUFFLFVBQVU7aUJBQ3hCLENBQUMsQ0FBQTtZQUNKLENBQUM7WUFDRCxHQUFHLEVBQUcsQ0FBQyxFQUFFLEVBQUUsRUFBRTtnQkFFWCxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyx1QkFBdUIsRUFBRTtvQkFDM0MsSUFBSSxFQUFFLEVBQUU7b0JBQ1IsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJO29CQUNmLFdBQVcsRUFBRSxVQUFVO2lCQUN4QixDQUFDLENBQUE7WUFDSixDQUFDO1NBQ0YsQ0FBQTtRQUVELElBQUksQ0FBQyxNQUFNLENBQUMsb0NBQW9DLE1BQU0sQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFBO1FBQzlELE9BQU8sTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLEVBQUUsRUFBRSxNQUFNLENBQUMsQ0FBQTtJQUNoRCxDQUFDO0lBRUQsSUFBSTtRQUNGLElBQUksQ0FBQyxTQUFTLEdBQUcsK0JBQWMsQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLENBQUE7UUFFaEQsSUFBSSxJQUFJLENBQUMsU0FBUyxLQUFLLFNBQVMsRUFBRSxDQUFDO1lBQ2pDLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxrQ0FBa0MsQ0FBQyxDQUFBO1FBQ3hELENBQUM7UUFDRCxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxDQUFBO1FBQ3BCLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFBO0lBQ3JELENBQUM7SUFFRCxPQUFPO1FBQ0wsSUFBSSxJQUFJLENBQUMsS0FBSyxLQUFLLFNBQVMsRUFBRSxDQUFDO1lBQzdCLGFBQWEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUE7UUFDM0IsQ0FBQztRQUVELElBQUksSUFBSSxDQUFDLFNBQVMsS0FBSyxTQUFTLEVBQUUsQ0FBQztZQUNqQyxJQUFJLENBQUMsU0FBUyxDQUFDLGNBQWMsQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQTtRQUNqRSxDQUFDO0lBQ0gsQ0FBQztJQUtELGNBQWMsQ0FBRSxVQUFtQixFQUFFLElBQW9DLEVBQUUsT0FBa0I7UUFDM0YsSUFBSSxPQUFPLElBQUksS0FBSyxVQUFVLEVBQUUsQ0FBQztZQUMvQixPQUFPLEdBQUcsSUFBSSxDQUFBO1lBQ2QsSUFBSSxHQUFHLFNBQVMsQ0FBQTtRQUNsQixDQUFDO1FBRUQsSUFBSSxPQUFPLFVBQVUsS0FBSyxRQUFRLEVBQUUsQ0FBQztZQUNuQyxPQUFPLENBQUMsS0FBSyxDQUFDLG9EQUFvRCxDQUFDLENBQUE7WUFDbkUsT0FBTTtRQUNSLENBQUM7UUFDRCxJQUFJLE9BQU8sT0FBTyxLQUFLLFVBQVUsRUFBRSxDQUFDO1lBQ2xDLE9BQU8sQ0FBQyxLQUFLLENBQUMsd0RBQXdELENBQUMsQ0FBQTtZQUN2RSxPQUFNO1FBQ1IsQ0FBQztRQUNELElBQUksSUFBSSxDQUFDLFNBQVMsS0FBSyxTQUFTLEVBQUUsQ0FBQztZQUNqQyxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsa0NBQWtDLENBQUMsQ0FBQTtRQUN4RCxDQUFDO1FBRUQsSUFBSSxJQUFJLEdBQUcsUUFBUSxDQUFBO1FBRW5CLElBQUksVUFBVSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLElBQUksVUFBVSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQztZQUM3RSxJQUFJLEdBQUcsVUFBVSxDQUFBO1FBQ25CLENBQUM7UUFFRCxNQUFNLEtBQUssR0FBRyxDQUFDLElBQUksRUFBRSxFQUFFO1lBRXJCLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRTtnQkFDL0IsRUFBRSxFQUFFLElBQUksSUFBSSxFQUFFLENBQUMsT0FBTyxFQUFFO2dCQUN4QixXQUFXLEVBQUUsVUFBVTtnQkFDdkIsTUFBTSxFQUFFLElBQUk7YUFDYixDQUFDLENBQUE7UUFDSixDQUFDLENBQUE7UUFFRCxNQUFNLE1BQU0sR0FBVztZQUNyQixJQUFJLEVBQUUsVUFBVTtZQUNoQixRQUFRLEVBQUUsS0FBSztZQUNmLE9BQU87WUFDUCxJQUFJO1lBQ0osUUFBUSxFQUFFLEtBQUs7WUFDZixLQUFLLEVBQUUsT0FBTyxDQUFDLE1BQU07WUFDckIsSUFBSTtTQUNMLENBQUE7UUFDRCxJQUFJLENBQUMsTUFBTSxDQUFDLHdDQUF3QyxNQUFNLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQTtRQUNsRSxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFVLEVBQUUsTUFBTSxDQUFDLENBQUE7UUFDcEMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUE7SUFDbEMsQ0FBQztJQUtELFlBQVksQ0FBRSxVQUFtQixFQUFFLE9BQWtCO1FBQ25ELElBQUksT0FBTyxVQUFVLEtBQUssUUFBUSxFQUFFLENBQUM7WUFDbkMsT0FBTyxDQUFDLEtBQUssQ0FBQyxvREFBb0QsQ0FBQyxDQUFBO1lBQ25FLE9BQU8sQ0FBQyxDQUFDLENBQUE7UUFDWCxDQUFDO1FBQ0QsSUFBSSxPQUFPLE9BQU8sS0FBSyxVQUFVLEVBQUUsQ0FBQztZQUNsQyxPQUFPLENBQUMsS0FBSyxDQUFDLHdEQUF3RCxDQUFDLENBQUE7WUFDdkUsT0FBTyxDQUFDLENBQUMsQ0FBQTtRQUNYLENBQUM7UUFDRCxJQUFJLElBQUksQ0FBQyxTQUFTLEtBQUssU0FBUyxFQUFFLENBQUM7WUFDakMsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLGtDQUFrQyxDQUFDLENBQUE7UUFDeEQsQ0FBQztRQUVELE1BQU0sTUFBTSxHQUFXO1lBQ3JCLElBQUksRUFBRSxVQUFVO1lBQ2hCLE9BQU87WUFDUCxJQUFJLEVBQUUsUUFBUTtZQUNkLFFBQVEsRUFBRSxJQUFJO1lBQ2QsS0FBSyxFQUFFLE9BQU8sQ0FBQyxNQUFNO1lBQ3JCLElBQUksRUFBRSxJQUFJO1NBQ1gsQ0FBQTtRQUNELElBQUksQ0FBQyxNQUFNLENBQUMsd0NBQXdDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFBO1FBQ2xFLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLFVBQVUsRUFBRSxNQUFNLENBQUMsQ0FBQTtRQUNwQyxJQUFJLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQTtJQUNsQyxDQUFDO0NBQ0Y7QUF0S0Qsc0NBc0tDIn0=