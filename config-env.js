/**
░█▀▀█ ░█▀▀█ ─█▀▀█ ░█▀▀█ ─█▀▀█ ▀▀█▀▀ ░█─░█ ── ░█▀▄▀█ ░█▀▀▄ 
░█▄▄█ ░█▄▄▀ ░█▄▄█ ░█▀▀▄ ░█▄▄█ ─░█── ░█▀▀█ ▀▀ ░█░█░█ ░█─░█ 
░█─── ░█─░█ ░█─░█ ░█▄▄█ ░█─░█ ─░█── ░█─░█ ── ░█──░█ ░█▄▄▀

* @project_name PRABATH-MD
* @authors Prabath Kumara & sachibot-team(Sachintha) <https://github.com/prabathLK>
* @description The main hope of creating this bot is to take full advantage of the WhatsApp app and make its work easier
* @link <https://github.com/prabathLK/PRABATH-MD>
* @version 2.0.6

© 2023 Prabath Kumara, SACHI-BOT. All rights reserved.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.*/

const fs = require('fs');
if (fs.existsSync('config.env')) require('dotenv').config({ path: './config.env' });

function convertToBool(text, fault = 'true') {
    return text === fault ? true : false;
}
module.exports = {
SESSION_ID: process.env.SESSION_ID || "PRABATH-MD~5j8ihRwI#EGDvegY66U1JjZVuUN5zWqDDXc727g6Bg2VuBhR0WAU",
BOT_NUMBER: process.env.BOT_NUMBER || "254111979755",
PASSWORD: process.env.PASSWORD || "Juliawangui06",
GITHUB_USERNAME: process.env.GITHUB_USERNAME || "kirubi1526",
GITHUB_AUTH_TOKEN: process.env.GITHUB_AUTH_TOKEN || "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"
};
