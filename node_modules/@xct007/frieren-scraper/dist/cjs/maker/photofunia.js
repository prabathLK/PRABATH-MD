"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.photofunia = void 0;
const Utils_1 = require("../Utils");
const Constant_1 = require("../Constant");
async function listEffects() {
    try {
        const { data } = await Utils_1.Axios.request({
            baseURL: Constant_1.PrivateApiPhotoFunia,
            url: "/getList",
        }).catch((e) => e?.response);
        if (typeof data === "object") {
            return data;
        }
        else {
            throw new Error(`Something went wrong with ${Constant_1.PrivateApiPhotoFunia}`);
        }
    }
    catch (e) {
        return {
            error: true,
            message: String(e),
        };
    }
}
async function create(name, opts) {
    try {
        const { data } = await Utils_1.Axios.post(Constant_1.PrivateApiPhotoFunia + "/createRequest/" + name, opts).catch((e) => e?.response);
        if (typeof data === "object") {
            return data;
        }
        else {
            throw new Error(`Something went wrong with ${Constant_1.PrivateApiPhotoFunia}`);
        }
    }
    catch (e) {
        return {
            error: true,
            message: String(e),
        };
    }
}
exports.photofunia = { listEffects, create };
