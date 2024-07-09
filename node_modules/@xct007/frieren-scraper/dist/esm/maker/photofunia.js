import { Axios } from "../Utils.js";
import { PrivateApiPhotoFunia } from "../Constant.js";
async function listEffects() {
    try {
        const { data } = await Axios.request({
            baseURL: PrivateApiPhotoFunia,
            url: "/getList",
        }).catch((e) => e?.response);
        if (typeof data === "object") {
            return data;
        }
        else {
            throw new Error(`Something went wrong with ${PrivateApiPhotoFunia}`);
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
        const { data } = await Axios.post(PrivateApiPhotoFunia + "/createRequest/" + name, opts).catch((e) => e?.response);
        if (typeof data === "object") {
            return data;
        }
        else {
            throw new Error(`Something went wrong with ${PrivateApiPhotoFunia}`);
        }
    }
    catch (e) {
        return {
            error: true,
            message: String(e),
        };
    }
}
export const photofunia = { listEffects, create };
