"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const got_1 = __importDefault(require("got"));
const vm_1 = __importDefault(require("vm"));
const index_js_1 = require("../types/index.js");
async function savefrom(url) {
    var _a, _b;
    index_js_1.SaveFromArgsSchema.parse(arguments);
    let scriptJS = await (0, got_1.default)('https://worker.sf-tools.com/savefrom.php', {
        method: 'POST',
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
            origin: 'https://id.savefrom.net',
            referer: 'https://id.savefrom.net/',
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.74 Safari/537.36'
        },
        form: {
            sf_url: encodeURI(url),
            sf_submit: '',
            new: 2,
            lang: 'id',
            app: '',
            country: 'id',
            os: 'Windows',
            browser: 'Chrome',
            channel: ' main',
            'sf-nomad': 1
        }
    }).text();
    const executeCode = '[]["filter"]["constructor"](b).call(a);';
    if (scriptJS.indexOf(executeCode) === -1)
        throw new Error(`Cannot find execute code\n${scriptJS}`);
    scriptJS = scriptJS.replace(executeCode, `
try {const script = ${executeCode.split('.call')[0]}.toString();if (script.includes('function showResult')) scriptResult = script;else (${executeCode.replace(/;/, '')});} catch {}
`);
    const context = {
        scriptResult: '',
        log: console.log
    };
    vm_1.default.createContext(context);
    new vm_1.default.Script(scriptJS).runInContext(context);
    const data = ((_a = context.scriptResult.split('window.parent.sf.videoResult.show(')) === null || _a === void 0 ? void 0 : _a[1]) || ((_b = context.scriptResult.split('window.parent.sf.videoResult.showRows(')) === null || _b === void 0 ? void 0 : _b[1]);
    if (!data)
        throw new Error(`Cannot find data ("${data}") from\n"${context.scriptResult}"`);
    let json;
    try {
        // @ts-ignore
        if (context.scriptResult.includes('showRows')) {
            const splits = data.split('],"');
            const lastIndex = splits.findIndex(v => v.includes('window.parent.sf.enableElement'));
            json = JSON.parse(splits.slice(0, lastIndex).join('],"') + ']');
        }
        else {
            json = [JSON.parse(data.split(');')[0])];
        }
    }
    catch (e) {
        json = null;
    }
    if (!(json === null || json === void 0 ? void 0 : json.length))
        throw new Error(`Cannot parse data ("${data}") from\n"${context.scriptResult}"`);
    return json.map(v => index_js_1.SaveFromSchema.parse(v));
}
exports.default = savefrom;
