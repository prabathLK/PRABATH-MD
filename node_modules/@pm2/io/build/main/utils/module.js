"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const Debug = require("debug");
const path = require("path");
const debug = Debug('axm:utils:module');
class ModuleUtils {
    static loadModule(modulePath, args) {
        let nodule;
        try {
            if (args) {
                nodule = require(modulePath).apply(this, args);
            }
            else {
                nodule = require(modulePath);
            }
            debug(`Succesfully required module at path ${modulePath}`);
            return nodule;
        }
        catch (err) {
            debug(`Failed to load module at path ${modulePath}: ${err.message}`);
            return err;
        }
    }
    static detectModule(moduleName) {
        const fakePath = ['./node_modules', '/node_modules'];
        if (!require.main) {
            return null;
        }
        const paths = typeof require.main.paths === 'undefined' ? fakePath : require.main.paths;
        const requirePaths = paths.slice();
        return ModuleUtils._lookForModule(requirePaths, moduleName);
    }
    static _lookForModule(requirePaths, moduleName) {
        const fsConstants = fs.constants || fs;
        for (let requirePath of requirePaths) {
            const completePath = path.join(requirePath, moduleName);
            debug(`Looking for module ${moduleName} in ${completePath}`);
            try {
                fs.accessSync(completePath, fsConstants.R_OK);
                debug(`Found module ${moduleName} in path ${completePath}`);
                return completePath;
            }
            catch (err) {
                debug(`module ${moduleName} not found in path ${completePath}`);
                continue;
            }
        }
        return null;
    }
}
exports.default = ModuleUtils;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3V0aWxzL21vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHlCQUF3QjtBQUN4QiwrQkFBOEI7QUFDOUIsNkJBQTRCO0FBRTVCLE1BQU0sS0FBSyxHQUFHLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQyxDQUFBO0FBRXZDLE1BQXFCLFdBQVc7SUFJOUIsTUFBTSxDQUFDLFVBQVUsQ0FBRSxVQUFrQixFQUFFLElBQWE7UUFDbEQsSUFBSSxNQUFNLENBQUE7UUFDVixJQUFJLENBQUM7WUFDSCxJQUFJLElBQUksRUFBRSxDQUFDO2dCQUNULE1BQU0sR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQTtZQUNoRCxDQUFDO2lCQUFNLENBQUM7Z0JBQ04sTUFBTSxHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQTtZQUM5QixDQUFDO1lBQ0QsS0FBSyxDQUFDLHVDQUF1QyxVQUFVLEVBQUUsQ0FBQyxDQUFBO1lBQzFELE9BQU8sTUFBTSxDQUFBO1FBQ2YsQ0FBQztRQUFDLE9BQU8sR0FBRyxFQUFFLENBQUM7WUFDYixLQUFLLENBQUMsaUNBQWlDLFVBQVUsS0FBSyxHQUFHLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQTtZQUNwRSxPQUFPLEdBQUcsQ0FBQTtRQUNaLENBQUM7SUFDSCxDQUFDO0lBS0QsTUFBTSxDQUFDLFlBQVksQ0FBRSxVQUFrQjtRQUNyQyxNQUFNLFFBQVEsR0FBRyxDQUFDLGdCQUFnQixFQUFFLGVBQWUsQ0FBQyxDQUFBO1FBQ3BELElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDbEIsT0FBTyxJQUFJLENBQUE7UUFDYixDQUFDO1FBQ0QsTUFBTSxLQUFLLEdBQUcsT0FBTyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssS0FBSyxXQUFXLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUE7UUFFdkYsTUFBTSxZQUFZLEdBQUcsS0FBSyxDQUFDLEtBQUssRUFBRSxDQUFBO1FBRWxDLE9BQU8sV0FBVyxDQUFDLGNBQWMsQ0FBQyxZQUFZLEVBQUUsVUFBVSxDQUFDLENBQUE7SUFDN0QsQ0FBQztJQUtPLE1BQU0sQ0FBQyxjQUFjLENBQUUsWUFBMkIsRUFBRSxVQUFrQjtRQUU1RSxNQUFNLFdBQVcsR0FBRyxFQUFFLENBQUMsU0FBUyxJQUFJLEVBQUUsQ0FBQTtRQUV0QyxLQUFLLElBQUksV0FBVyxJQUFJLFlBQVksRUFBRSxDQUFDO1lBQ3JDLE1BQU0sWUFBWSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLFVBQVUsQ0FBQyxDQUFBO1lBQ3ZELEtBQUssQ0FBQyxzQkFBc0IsVUFBVSxPQUFPLFlBQVksRUFBRSxDQUFDLENBQUE7WUFDNUQsSUFBSSxDQUFDO2dCQUNILEVBQUUsQ0FBQyxVQUFVLENBQUMsWUFBWSxFQUFFLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQTtnQkFDN0MsS0FBSyxDQUFDLGdCQUFnQixVQUFVLFlBQVksWUFBWSxFQUFFLENBQUMsQ0FBQTtnQkFDM0QsT0FBTyxZQUFZLENBQUE7WUFDckIsQ0FBQztZQUFDLE9BQU8sR0FBRyxFQUFFLENBQUM7Z0JBQ2IsS0FBSyxDQUFDLFVBQVUsVUFBVSxzQkFBc0IsWUFBWSxFQUFFLENBQUMsQ0FBQTtnQkFDL0QsU0FBUTtZQUNWLENBQUM7UUFDSCxDQUFDO1FBQ0QsT0FBTyxJQUFJLENBQUE7SUFDYixDQUFDO0NBQ0Y7QUF4REQsOEJBd0RDIn0=