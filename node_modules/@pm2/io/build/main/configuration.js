"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const debug_1 = require("debug");
const debug = (0, debug_1.default)('axm:configuration');
const serviceManager_1 = require("./serviceManager");
const autocast_1 = require("./utils/autocast");
const path = require("path");
const fs = require("fs");
class Configuration {
    static configureModule(opts) {
        if (serviceManager_1.ServiceManager.get('transport'))
            serviceManager_1.ServiceManager.get('transport').setOptions(opts);
    }
    static findPackageJson() {
        try {
            require.main = Configuration.getMain();
        }
        catch (_e) {
        }
        if (!require.main) {
            return;
        }
        if (!require.main.paths) {
            return;
        }
        let pkgPath = path.resolve(path.dirname(require.main.filename), 'package.json');
        try {
            fs.statSync(pkgPath);
        }
        catch (e) {
            try {
                pkgPath = path.resolve(path.dirname(require.main.filename), '..', 'package.json');
                fs.statSync(pkgPath);
            }
            catch (e) {
                debug('Cannot find package.json');
                try {
                    pkgPath = path.resolve(path.dirname(require.main.filename), '..', '..', 'package.json');
                    fs.statSync(pkgPath);
                }
                catch (e) {
                    debug('Cannot find package.json');
                    return null;
                }
            }
            return pkgPath;
        }
        return pkgPath;
    }
    static init(conf, doNotTellPm2) {
        const packageFilepath = Configuration.findPackageJson();
        let packageJson;
        if (!conf.module_conf) {
            conf.module_conf = {};
        }
        conf.apm = {
            type: 'node',
            version: null
        };
        try {
            const prefix = __dirname.replace(/\\/g, '/').indexOf('/build/') >= 0 ? '../../' : '../';
            const pkg = require(prefix + 'package.json');
            conf.apm.version = pkg.version || null;
        }
        catch (err) {
            debug('Failed to fetch current apm version: ', err.message);
        }
        if (conf.isModule === true) {
            try {
                packageJson = require(packageFilepath || '');
                conf.module_version = packageJson.version;
                conf.module_name = packageJson.name;
                conf.description = packageJson.description;
                if (packageJson.config) {
                    conf = Object.assign(conf, packageJson.config);
                    conf.module_conf = packageJson.config;
                }
            }
            catch (e) {
                throw new Error(e);
            }
        }
        else {
            conf.module_name = process.env.name || 'outside-pm2';
            try {
                packageJson = require(packageFilepath || '');
                conf.module_version = packageJson.version;
                if (packageJson.config) {
                    conf = Object.assign(conf, packageJson.config);
                    conf.module_conf = packageJson.config;
                }
            }
            catch (e) {
                debug(e.message);
            }
        }
        try {
            if (process.env[conf.module_name]) {
                const castedConf = new autocast_1.default().autocast(JSON.parse(process.env[conf.module_name] || ''));
                conf = Object.assign(conf, castedConf);
                delete castedConf.probes;
                conf.module_conf = JSON.parse(JSON.stringify(Object.assign(conf.module_conf, castedConf)));
                Object.keys(conf.module_conf).forEach(function (key) {
                    if ((key === 'password' || key === 'passwd') &&
                        conf.module_conf[key].length >= 1) {
                        conf.module_conf[key] = 'Password hidden';
                    }
                });
            }
        }
        catch (e) {
            debug(e);
        }
        if (doNotTellPm2 === true)
            return conf;
        Configuration.configureModule(conf);
        return conf;
    }
    static getMain() {
        return require.main || { filename: './somefile.js' };
    }
}
exports.default = Configuration;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlndXJhdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb25maWd1cmF0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsaUNBQXlCO0FBQ3pCLE1BQU0sS0FBSyxHQUFHLElBQUEsZUFBSyxFQUFDLG1CQUFtQixDQUFDLENBQUE7QUFFeEMscURBQWlEO0FBQ2pELCtDQUF1QztBQUN2Qyw2QkFBNEI7QUFDNUIseUJBQXdCO0FBRXhCLE1BQXFCLGFBQWE7SUFFaEMsTUFBTSxDQUFDLGVBQWUsQ0FBRSxJQUFJO1FBQzFCLElBQUksK0JBQWMsQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDO1lBQUUsK0JBQWMsQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFBO0lBQ3ZGLENBQUM7SUFFRCxNQUFNLENBQUMsZUFBZTtRQUNwQixJQUFJLENBQUM7WUFDSCxPQUFPLENBQUMsSUFBSSxHQUFHLGFBQWEsQ0FBQyxPQUFPLEVBQUUsQ0FBQTtRQUN4QyxDQUFDO1FBQUMsT0FBTyxFQUFFLEVBQUUsQ0FBQztRQUVkLENBQUM7UUFFRCxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxDQUFDO1lBQ2xCLE9BQU07UUFDUixDQUFDO1FBRUQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7WUFDeEIsT0FBTTtRQUNSLENBQUM7UUFFRCxJQUFJLE9BQU8sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsRUFBRSxjQUFjLENBQUMsQ0FBQTtRQUMvRSxJQUFJLENBQUM7WUFDSCxFQUFFLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFBO1FBQ3RCLENBQUM7UUFBQyxPQUFPLENBQUMsRUFBRSxDQUFDO1lBQ1gsSUFBSSxDQUFDO2dCQUNILE9BQU8sR0FB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