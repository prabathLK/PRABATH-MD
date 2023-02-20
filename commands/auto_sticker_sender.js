const { tlang,cmd } = require('../lib')
const { Sticker, createSticker, StickerTypes } = require("wa-sticker-formatter");
const Config = require('../config')
const axios = require('axios')
// Put here your url with modified words and urls
const url = 'https://gist.github.com/prabathLK/fbd8017006fc4000dc82403d443ecd9b/raw'

/**
 cmd({
            pattern: "autosticker",
            category: "owner",
            use: '',
        },
**/ 
cmd({ on: "text" }, async (Void,citel,text,{isCreator})=> {
  let { data } = await axios.get(url)
  for (vr in data){
 if((new RegExp(`\\b${vr}\\b`,'gi')).test(citel.text)) return Void.sendMessage(citel.chat,{image: { url : data[vr]},mimetype: 'image/webp'},{quoted:citel})   
}
})
