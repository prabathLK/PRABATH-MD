"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceManager = exports.Service = void 0;
const services = new Map();
class Service {
}
exports.Service = Service;
class ServiceManager {
    static get(serviceName) {
        return services.get(serviceName);
    }
    static set(serviceName, service) {
        return services.set(serviceName, service);
    }
    static reset(serviceName) {
        return services.delete(serviceName);
    }
}
exports.ServiceManager = ServiceManager;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VydmljZU1hbmFnZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvc2VydmljZU1hbmFnZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQ0EsTUFBTSxRQUFRLEdBQXFCLElBQUksR0FBRyxFQUFlLENBQUE7QUFFekQsTUFBYSxPQUFPO0NBQUc7QUFBdkIsMEJBQXVCO0FBRXZCLE1BQWEsY0FBYztJQUVsQixNQUFNLENBQUMsR0FBRyxDQUFFLFdBQW1CO1FBQ3BDLE9BQU8sUUFBUSxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsQ0FBQTtJQUNsQyxDQUFDO0lBRU0sTUFBTSxDQUFDLEdBQUcsQ0FBRSxXQUFtQixFQUFFLE9BQWdCO1FBQ3RELE9BQU8sUUFBUSxDQUFDLEdBQUcsQ0FBQyxXQUFXLEVBQUUsT0FBTyxDQUFDLENBQUE7SUFDM0MsQ0FBQztJQUVNLE1BQU0sQ0FBQyxLQUFLLENBQUUsV0FBbUI7UUFDdEMsT0FBTyxRQUFRLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFBO0lBQ3JDLENBQUM7Q0FDRjtBQWJELHdDQWFDIn0=