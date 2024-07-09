"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Diffusion_queue;
Object.defineProperty(exports, "__esModule", { value: true });
exports.diffusion = void 0;
const Utils_1 = require("../Utils");
const Constant_1 = require("../Constant");
class Diffusion {
    constructor() {
        _Diffusion_queue.set(this, void 0);
        __classPrivateFieldSet(this, _Diffusion_queue, 0, "f");
        this.example = "beatiful girl, looking to viewer, warm smile,";
        this.advanceExample =
            "SamDoesArt, a girl, brown hair, blue eyes, black hoodie, piercing, tattoos, day, sunny, cars, city, HDRI, masterpiece, sharp focus, smooth, illustration, golden ratio,";
    }
    add() {
        __classPrivateFieldSet(this, _Diffusion_queue, __classPrivateFieldGet(this, _Diffusion_queue, "f") + 1, "f");
    }
    remove() {
        __classPrivateFieldSet(this, _Diffusion_queue, __classPrivateFieldGet(this, _Diffusion_queue, "f") - 1, "f");
    }
    async stable(prompt, seed = false) {
        if (__classPrivateFieldGet(this, _Diffusion_queue, "f") >= 5) {
            return {
                error: true,
                message: "Please wait, you in position " + (__classPrivateFieldGet(this, _Diffusion_queue, "f") + 1),
            };
        }
        try {
            this.add();
            if (!seed) {
                seed = Math.random().toString().substring(2, 11);
            }
            const { data } = await Utils_1.Axios.request({
                baseURL: Constant_1.PrivateWorkerApiItsrose,
                url: "/api/stableDiffusion",
                method: "POST",
                data: new URLSearchParams({ prompt, seed: String(seed) }),
            }).catch((e) => e?.response);
            this.remove();
            return data;
        }
        catch (e) {
            return {
                error: true,
                message: String(e),
            };
        }
    }
}
_Diffusion_queue = new WeakMap();
exports.diffusion = new Diffusion();
