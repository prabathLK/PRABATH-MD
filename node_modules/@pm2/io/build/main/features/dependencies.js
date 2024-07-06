"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DependenciesFeature = void 0;
const serviceManager_1 = require("../serviceManager");
const Debug = require("debug");
const configuration_1 = require("../configuration");
const fs_1 = require("fs");
class DependenciesFeature {
    constructor() {
        this.logger = Debug('axm:features:dependencies');
    }
    init() {
        this.transport = serviceManager_1.ServiceManager.get('transport');
        this.logger('init');
        const pkgPath = configuration_1.default.findPackageJson();
        if (typeof pkgPath !== 'string')
            return this.logger('failed to found pkg.json path');
        this.logger(`found pkg.json in ${pkgPath}`);
        (0, fs_1.readFile)(pkgPath, (err, data) => {
            if (err)
                return this.logger(`failed to read pkg.json`, err);
            try {
                const pkg = JSON.parse(data.toString());
                if (typeof pkg.dependencies !== 'object') {
                    return this.logger(`failed to find deps in pkg.json`);
                }
                const dependencies = Object.keys(pkg.dependencies)
                    .reduce((list, name) => {
                    list[name] = { version: pkg.dependencies[name] };
                    return list;
                }, {});
                this.logger(`collected ${Object.keys(dependencies).length} dependencies`);
                this.transport.send('application:dependencies', dependencies);
                this.logger('sent dependencies list');
            }
            catch (err) {
                return this.logger(`failed to parse pkg.json`, err);
            }
        });
    }
    destroy() {
        this.logger('destroy');
    }
}
exports.DependenciesFeature = DependenciesFeature;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVwZW5kZW5jaWVzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2ZlYXR1cmVzL2RlcGVuZGVuY2llcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxzREFBa0Q7QUFDbEQsK0JBQThCO0FBRzlCLG9EQUE0QztBQUM1QywyQkFBNkI7QUFLN0IsTUFBYSxtQkFBbUI7SUFBaEM7UUFHVSxXQUFNLEdBQWEsS0FBSyxDQUFDLDJCQUEyQixDQUFDLENBQUE7SUFrQy9ELENBQUM7SUFoQ0MsSUFBSTtRQUNGLElBQUksQ0FBQyxTQUFTLEdBQUcsK0JBQWMsQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLENBQUE7UUFDaEQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQTtRQUVuQixNQUFNLE9BQU8sR0FBRyx1QkFBYSxDQUFDLGVBQWUsRUFBRSxDQUFBO1FBQy9DLElBQUksT0FBTyxPQUFPLEtBQUssUUFBUTtZQUFFLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQywrQkFBK0IsQ0FBQyxDQUFBO1FBRXBGLElBQUksQ0FBQyxNQUFNLENBQUMscUJBQXFCLE9BQU8sRUFBRSxDQUFDLENBQUE7UUFDM0MsSUFBQSxhQUFRLEVBQUMsT0FBTyxFQUFFLENBQUMsR0FBRyxFQUFFLElBQUksRUFBRSxFQUFFO1lBQzlCLElBQUksR0FBRztnQkFBRSxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMseUJBQXlCLEVBQUUsR0FBRyxDQUFDLENBQUE7WUFDM0QsSUFBSSxDQUFDO2dCQUNILE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUE7Z0JBQ3ZDLElBQUksT0FBTyxHQUFHLENBQUMsWUFBWSxLQUFLLFFBQVEsRUFBRSxDQUFDO29CQUN6QyxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsaUNBQWlDLENBQUMsQ0FBQTtnQkFDdkQsQ0FBQztnQkFDRCxNQUFNLFlBQVksR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxZQUErQixDQUFDO3FCQUNsRSxNQUFNLENBQUMsQ0FBQyxJQUFvQixFQUFFLElBQVksRUFBRSxFQUFFO29CQUM3QyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxPQUFPLEVBQUUsR0FBRyxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFBO29CQUNoRCxPQUFPLElBQUksQ0FBQTtnQkFDYixDQUFDLEVBQUUsRUFBb0IsQ0FBQyxDQUFBO2dCQUMxQixJQUFJLENBQUMsTUFBTSxDQUFDLGFBQWEsTUFBTSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxNQUFNLGVBQWUsQ0FBQyxDQUFBO2dCQUN6RSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQywwQkFBMEIsRUFBRSxZQUFZLENBQUMsQ0FBQTtnQkFDN0QsSUFBSSxDQUFDLE1BQU0sQ0FBQyx3QkFBd0IsQ0FBQyxDQUFBO1lBQ3ZDLENBQUM7WUFBQyxPQUFPLEdBQUcsRUFBRSxDQUFDO2dCQUNiLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQywwQkFBMEIsRUFBRSxHQUFHLENBQUMsQ0FBQTtZQUNyRCxDQUFDO1FBQ0gsQ0FBQyxDQUFDLENBQUE7SUFDSixDQUFDO0lBRUQsT0FBTztRQUNMLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUE7SUFDeEIsQ0FBQztDQUNGO0FBckNELGtEQXFDQyJ9