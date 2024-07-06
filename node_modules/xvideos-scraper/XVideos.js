const axios = require("axios")
const cheerio = require("cheerio")
const entities = require("entities");
const FormData = require('form-data');
const qs = require('qs')

module.exports.searchVideo = async (val)=>{
 if (val.proxy === false || typeof val.proxy == "undefined"){
  try {
   var obj = {
    k: val.search,
    sort: val.sort,
    datef: val.filterDate,
    durf: val.filterDuration,
    quality: val.filterQuality,
    vw: val.viewWatched,
    p: val.pagination - 1,
    top: ''
   }
   Object.keys(obj).forEach(key => {
    if (obj[key] === (undefined || "undefined")) {
     delete obj[key];
    }
   });
   query = qs.stringify(obj);
   let url = `http://www.xvideos2.com/?${query}`
   var {data} = await axios(url)
   $ = cheerio.load(data)
   let videosContainer = $("div[id='content'] div[class='mozaique cust-nb-cols'] div[class='thumb-block  ']");
   let arr = [];
   videosContainer.each((idx, el) => {
    let obj = {};
    obj.video = "https:\/\/www.xvideos2.com"+$(el).children("div[class='thumb-inside']").children("div[class='thumb']").children("a").attr("href");
    obj.thumbnail = $(el).children("div[class='thumb-inside']").children("div[class='thumb']").children("a").children("img").attr("data-src");
    obj.title = $(el).children("div[class='thumb-under']").children("p").children("a").attr("title");
    obj.duration = $(el).children("div[class='thumb-under']").children("p").children("a").children("span[class='duration']").text();
    obj.uploaderName = $(el).children("div[class='thumb-under']").children("p[class='metadata']").children("span").children("span").children("a").children("span[class='name']").text();
    obj.uploaderProfile = "https:\/\/www.xvideos2.com"+$(el).children("div[class='thumb-under']").children("p[class='metadata']").children("span").children("span").children("a").attr("href");
    arr.push(obj);
   });
   return arr
  }
  catch (e){
   return e.response
  }
 } else if (val.proxy === true) {
  try {
   var obj = {
    k: val.search,
    sort: val.sort,
    datef: val.filterDate,
    durf: val.filterDuration,
    quality: val.filterQuality,
    vw: val.viewWatched,
    p: val.pagination - 1,
    top: ''
   }
   Object.keys(obj).forEach(key => {
    if (obj[key] === (undefined || "undefined")) {
     delete obj[key];
    }
   });
   query = qs.stringify(obj)
   query = "http://www.xvideos2.com/?"+query
   var bodyFormData = new FormData();
   bodyFormData.append('url', query);
   let html = await axios({
    method: "post",
    url: "https://zend2.com/index.php",
    data: bodyFormData,
    headers: {
     "Content-Type": "multipart/form-data"
    }
   })
   $ = cheerio.load(html.data)
   let videosContainer = $("div[id='content'] div[class='mozaique cust-nb-cols'] div[class='thumb-block  ']");
   let arr = [];
   videosContainer.each((idx, el) => {
    let obj = {};
    obj.video = $(el).children("div[class='thumb-inside']").children("div[class='thumb']").children("a").attr("href");
    obj.title = $(el).children("div[class='thumb-under']").children("p").children("a").attr("title");
    obj.duration = $(el).children("div[class='thumb-under']").children("p").children("a").children("span[class='duration']").text();
    obj.uploaderName = $(el).children("div[class='thumb-under']").children("p[class='metadata']").children("span").children("span").children("a").children("span[class='name']").text();
    obj.uploaderProfile = $(el).children("div[class='thumb-under']").children("p[class='metadata']").children("span").children("span").children("a").attr("href");
    arr.push(obj);
   });
   return arr
  }
  catch (e){
   return e.response
  }
 }
}

module.exports.getVideoData = async (val)=>{
 if (val.proxy === false || typeof val.proxy == "undefined"){
  try {
   var {data} = await axios(val.videoUrl)
   $ = cheerio.load(data)
   let obj = {}
   obj.Default_Quality = $($("div[id='html5video'] div[id='html5video_base'] div").children("a")[0]).attr("href")
   obj.Low_Quality = $($("div[id='html5video'] div[id='html5video_base'] div").children("a")[1]).attr("href")
   obj.HD_Quality = $($("div[id='html5video'] div[id='html5video_base'] div").children("a")[2]).attr("href")
   obj.UHD_Quality = $($("script")[8]).text().split("setVideoHLS")[1].split("('")[1].split("')")[0]
   let arr = [JSON.parse($($("script")[2]).text().replace(/@/g,""))]
   arr[0].contentUrl = obj
   arr[0].name = entities.decodeHTML(arr[0].name)
   arr[0].description = entities.decodeHTML(arr[0].description)
   arr[0].interactionStatistic.userInteractionCount = arr[0].interactionStatistic.userInteractionCount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+" Views";
   const {type,context,duration, ...newObj} = arr[0]
   return {...newObj}
  }
  catch (e){
   return e.response
  }
 } else if (val.proxy === true){
  try {
   var {data} = await axios.get(val.videoUrl)
   $ = cheerio.load(data)
   var arr = [JSON.parse($($("script")[2]).text().replace(/@/g,""))]
   arr[0].name = entities.decodeHTML(arr[0].name)
   arr[0].description = entities.decodeHTML(arr[0].description)
   const {type,context,duration, ...newObj} = arr[0]
   return {...newObj}
  }
  catch (e){
   return e.response
  }
 }
}