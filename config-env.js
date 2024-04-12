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
    return text === fault ? true : true;
}
module.exports = {
SESSION_ID: process.env.SESSION_ID || "PRABATH-MD~M3NT2QRb#utbELKzrAIyqew61ZOsMQkHZV4PoKSM1QE03Zl3uKx8",
BOT_NUMBER: process.env.BOT_NUMBER || "260776642930 (without + mark and spaces)",
PASSWORD: process.env.PASSWORD || "200518Kay",
GITHUB_USERNAME: process.env.GITHUB_USERNAME || "Kapskay",
GITHUB_AUTH_TOKEN: process.env.GITHUB_AUTH_TOKEN || "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"
};
