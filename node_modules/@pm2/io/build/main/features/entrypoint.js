"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Entrypoint = void 0;
const IO_KEY = Symbol.for('@pm2/io');
class Entrypoint {
    constructor() {
        try {
            this.io = global[IO_KEY].init(this.conf());
            this.onStart(err => {
                if (err) {
                    console.error(err);
                    process.exit(1);
                }
                this.sensors();
                this.events();
                this.actuators();
                this.io.onExit((code, signal) => {
                    this.onStop(err, () => {
                        this.io.destroy();
                    }, code, signal);
                });
                if (process && process.send)
                    process.send('ready');
            });
        }
        catch (e) {
            if (this.io) {
                this.io.destroy();
            }
            throw (e);
        }
    }
    events() {
        return;
    }
    sensors() {
        return;
    }
    actuators() {
        return;
    }
    onStart(cb) {
        throw new Error('Entrypoint onStart() not specified');
    }
    onStop(err, cb, code, signal) {
        return cb();
    }
    conf() {
        return undefined;
    }
}
exports.Entrypoint = Entrypoint;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50cnlwb2ludC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9mZWF0dXJlcy9lbnRyeXBvaW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUVBLE1BQU0sTUFBTSxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUE7QUFFcEMsTUFBYSxVQUFVO0lBR3JCO1FBQ0UsSUFBSSxDQUFDO1lBQ0gsSUFBSSxDQUFDLEVBQUUsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFBO1lBRTFDLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUU7Z0JBQ2pCLElBQUksR0FBRyxFQUFFLENBQUM7b0JBQ1IsT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQTtvQkFDbEIsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQTtnQkFDakIsQ0FBQztnQkFFRCxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUE7Z0JBQ2QsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFBO2dCQUNiLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQTtnQkFFaEIsSUFBSSxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLEVBQUU7b0JBQzlCLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRTt3QkFDcEIsSUFBSSxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsQ0FBQTtvQkFDbkIsQ0FBQyxFQUFFLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQTtnQkFDbEIsQ0FBQyxDQUFDLENBQUE7Z0JBRUYsSUFBSSxPQUFPLElBQUksT0FBTyxDQUFDLElBQUk7b0JBQUUsT0FBTyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQTtZQUNwRCxDQUFDLENBQUMsQ0FBQTtRQUNKLENBQUM7UUFBQyxPQUFPLENBQUMsRUFBRSxDQUFDO1lBRVgsSUFBSSxJQUFJLENBQUMsRUFBRSxFQUFFLENBQUM7Z0JBQ1osSUFBSSxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsQ0FBQTtZQUNuQixDQUFDO1lBRUQsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFBO1FBQ1gsQ0FBQztJQUNILENBQUM7SUFFRCxNQUFNO1FBQ0osT0FBTTtJQUNSLENBQUM7SUFFRCxPQUFPO1FBQ0wsT0FBTTtJQUNSLENBQUM7SUFFRCxTQUFTO1FBQ1AsT0FBTTtJQUNSLENBQUM7SUFFRCxPQUFPLENBQUUsRUFBWTtRQUNuQixNQUFNLElBQUksS0FBSyxDQUFDLG9DQUFvQyxDQUFDLENBQUE7SUFDdkQsQ0FBQztJQUVELE1BQU0sQ0FBRSxHQUFVLEVBQUUsRUFBWSxFQUFFLElBQVksRUFBRSxNQUFjO1FBQzVELE9BQU8sRUFBRSxFQUFFLENBQUE7SUFDYixDQUFDO0lBRUQsSUFBSTtRQUNGLE9BQU8sU0FBUyxDQUFBO0lBQ2xCLENBQUM7Q0FDRjtBQTFERCxnQ0EwREMifQ==