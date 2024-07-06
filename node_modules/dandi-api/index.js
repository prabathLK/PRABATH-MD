const axios = require('axios')
const cheerio = require('cheerio')
const request = require('request')
const qs = require('qs')
const cookie = require('cookie')
const FormData = require('form-data')
const { JSDOM } = require('jsdom')
const fetch = require('node-fetch')
const yts = require('yt-search')
const author = "@dandisubhani_"

const film = (query) => {
    return new Promise((resolve, reject) => {
        axios.get(`http://167.99.31.48/?s=${query}`)
            .then(({
                data
            }) => {
                const $ = cheerio.load(data)
                const hasil = [];
                $('#content > div > div.los').each(function (a, b) {
                    $(b).find('article').each(function (c, d) {
                        const judul = $(d).find('div > a > div.addinfox > header > h2').text()
                        const quality = $(d).find('div > a > div > div > span').text()
                        const type = $(d).find('div > a > div.addinfox > div > i.type').text()
                        const upload = $(d).find('div > a > div.addinfox > div > span').text()
                        const link = $(d).find('div > a').attr('href');
                        const thumb = $(d).find('div > a > div > img').attr('src');
                        const result = {
                            status: 200,
                            author: author,
                            judul: judul,
                            quality: quality,
                            type: type,
                            upload: upload,
                            link: link,
                            thumb: thumb,
                        };
                        hasil.push(result);
                    });
                });
                resolve(hasil)
            })
            .catch(reject)
    })
}
const anime = (query) => {
    return new Promise((resolve, reject) => {
        axios.get(`https://www.anime-planet.com/anime/all?name=${query}`)
            .then(({
                data
            }) => {
                const hasil = []
                const $ = cheerio.load(data)
                $('#siteContainer > ul.cardDeck.cardGrid > li ').each(function (a, b) {
                        result = {
                            status: 200,
                            author: author,
                            judul: $(b).find('> a > h3').text(),
                            link: 'https://www.anime-planet.com' + $(b).find('> a').attr('href'),
                            thumbnail: 'https://www.anime-planet.com' + $(b).find('> a > div.crop > img').attr('src')
                        };
                        hasil.push(result);
                    });
                resolve(hasil)
            })
            .catch(reject)
    })
}
const manga = (query) => {
    return new Promise((resolve, reject) => {
        axios.get(`https://www.anime-planet.com/manga/all?name=${query}`)
            .then(({
                data
            }) => {
                const hasil = []
                const $ = cheerio.load(data)
                $('#siteContainer > ul.cardDeck.cardGrid > li ').each(function (a, b) {
                        result = {
                            status: 200,
                            author: author,
                            judul: $(b).find('> a > h3').text(),
                            link: 'https://www.anime-planet.com' + $(b).find('> a').attr('href'),
                            thumbnail: 'https://www.anime-planet.com' + $(b).find('> a > div.crop > img').attr('src')
                        };
                        hasil.push(result);
                    });
                resolve(hasil)
            })
            .catch(reject)
    })
}
const character = (query) => {
    return new Promise((resolve, reject) => {
        axios.get(`https://www.anime-planet.com/characters/all?name=${query}`)
            .then(({
                data
            }) => {
                const hasil = []
                const $ = cheerio.load(data)
                $('#siteContainer > table > tbody > tr').each(function (a, b) {
                        result = {
                            status: 200,
                            author: author,
                            character: $(b).find('> td.tableCharInfo > a').text(),
                            link: 'https://www.anime-planet.com' + $(b).find('> td.tableCharInfo > a').attr('href'),
                            thumbnail: $(b).find('> td.tableAvatar > a > img').attr('src').startsWith('https://') ? $(b).find('> td.tableAvatar > a > img').attr('src') : 'https://www.anime.planet.com' + $(b).find('> td.tableAvatar > a > img').attr('src')
                        };
                        hasil.push(result);
                    });
                resolve(hasil)
            })
            .catch(reject)
    })
}
const jadwalbola = () => {
    return new Promise((resolve, reject) => {
        axios.get('https://m.bola.net/jadwal_televisi/')
            .then(({
                data
            }) => {
                const $ = cheerio.load(data)
                const hasil = [];
                $('#main_mid_headline_sub_topic').each(function(a, b) {
                    result = {
                    status: 200,
                    author: author,
                    jadwal: $(b).find(' > div.main_mid_headline_topic > div > a').text(),
                    tanggal: $(b).find(' > div.main_mid_headline_topic_grouped_time_list').text().split('\n')[1].split('                            ')[1],
                    jam: $(b).find(' > div.main_mid_headline_topic > span').text(),
                    url: $(b).find(' > div.main_mid_headline_topic > div > a').attr('href'),
                    thumb: $(b).find(' > div.main_mid_headline_topic > img').attr('src')
                }
                hasil.push(result)
                })
                resolve(hasil)
            })
            .catch(reject)
    })
}
const jadwaltv = () => {
    return new Promise((resolve, reject) => {
        axios.get('http://www.dokitv.com/jadwal-acara-tv')
            .then(({
                data
            }) => {
                const $ = cheerio.load(data)
                const hasil = [];
                $('#tabeljadwaltv > tbody > tr ').each(function(a, b) {
                    result = {
                    status: 200,
                    author: author,
                    acara: $(b).find('> td:nth-child(2)').text(),
                    channel: $(b).find('> td > a').text(),
                    jam: $(b).find('> td.jfx').text(),
                    source: $(b).find('> td > a').attr('href')
                }
                hasil.push(result)
                })
                resolve(hasil)
            })
            .catch(reject)
    })
}
const jadwalsholat = (query) => {
    return new Promise((resolve, reject) => {
        axios.get(`https://umrotix.com/jadwal-sholat/${query}`)
            .then(({
                data
            }) => {
                const $ = cheerio.load(data)
                $('body > div > div.main-wrapper.scrollspy-action > div:nth-child(3) ').each(function(a, b) {   
                    result = {
                    status: 200,
                    author: author,
                    tanggal: $(b).find('> div:nth-child(2)').text(),
                    imsyak: $(b).find('> div.panel.daily > div > div > div > div > div:nth-child(1) > p:nth-child(2)').text(),
                    subuh: $(b).find('> div.panel.daily > div > div > div > div > div:nth-child(2) > p:nth-child(2)').text(),
                    dzuhur: $(b).find('> div.panel.daily > div > div > div > div > div:nth-child(3) > p:nth-child(2)').text(),
                    ashar: $(b).find('> div.panel.daily > div > div > div > div > div:nth-child(4) > p:nth-child(2)').text(),
                    maghrib: $(b).find('> div.panel.daily > div > div > div > div > div:nth-child(5) > p:nth-child(2)').text(),
                    isya: $(b).find('> div.panel.daily > div > div > div > div > div:nth-child(6) > p:nth-child(2)').text()
                }
                resolve(result)
                })
            })
            .catch(reject)
    })
}
const wattpad = (query) => {
    return new Promise((resolve, reject) => {
        axios.get('https://www.wattpad.com/search/' + query)
            .then(({
                data
            }) => {
                const $ = cheerio.load(data)
                const result = [];
                const linkk = [];
                const judull = [];
                const thumb = [];
                const dibaca = [];
                const vote = [];
                const bab = [];
                $('ul.list-group > li.list-group-item').each(function(a, b) {
                    linkk.push('https://www.wattpad.com' + $(b).find('a').attr('href'))
                    thumb.push($(b).find('img').attr('src'))
                })
                $('div.story-card-data.hidden-xxs > div.story-info > ul > li:nth-child(1) > div.icon-container > div > span.stats-value').each(function(e, f) {
                    baca = $(f).text();
                    dibaca.push(baca)
                })
                $('div.story-card-data.hidden-xxs > div.story-info > ul > li:nth-child(2) > div.icon-container > div > span.stats-value').each(function(g, h) {
                    vot = $(h).text();
                    vote.push(vot)
                })
                $('div.story-card-data.hidden-xxs > div.story-info > ul > li:nth-child(3) > div.icon-container > div > span.stats-value').each(function(i, j) {
                    bb = $(j).text();
                    bab.push(bb)
                })
                $('div.story-card-data.hidden-xxs > div.story-info > div.title').each(function(c, d) {
                    titel = $(d).text();
                    judull.push(titel)
                })
                for (let i = 0; i < linkk.length; i++) {
                    if (!judull[i] == '') {
                        result.push({
                            judul: judull[i],
                            dibaca: dibaca[i],
                            divote: vote[i],
                            thumb: thumb[i],
                            link: linkk[i]
                        })
                    }
                }
                resolve(result)
            })
            .catch(reject)
    })
}

const wattpaduser = (query) => {
    return new Promise((resolve, reject) => {
        axios.get(`https://www.wattpad.com/user/${query}`)
            .then(({
                data
            }) => {
                const $ = cheerio.load(data)
                $('#app-container > div > header ').each(function(a, b) {
                    $('#profile-about > div > div ').each(function(c, d) {
                    result = {
                    status: 200,
                    author: author,
                    username: $(b).find('> div.badges > h1').text().trim(),
                    works: $(b).find('> div.row.header-metadata > div:nth-child(1) > p:nth-child(1)').text(),
                    reading_list: $(b).find('> div.row.header-metadata > div.col-xs-4.scroll-to-element > p:nth-child(1)').text(),
                    followers: $(b).find('> div.row.header-metadata > div.col-xs-4.on-followers > p.followers-count').text(),
                    joined: $(d).find('> ul > li.date.col-xs-12.col-sm-12 > span').text().trim().replace('Joined',''),
                    pp_picture: `https://img.wattpad.com/useravatar/${query}.128.851744.jpg`,
                    about: $(d).find('> div.description > pre').text() ? $(d).find('> div.description > pre').text() : 'Not found'
                }
                resolve(result)
                })
                })
            })
            .catch(reject)
    })
}
const mangatoons = (query) => {
    return new Promise((resolve, reject) => {
        axios.get(`https://mangatoon.mobi/en/search?word=${query}`)
            .then(({
                data
            }) => {
                const $ = cheerio.load(data)
                const hasil = [];
                 $('#page-content > div.search-page > div > div.comics-result > div.recommended-wrap > div > div ').each(function(a, b) {
                    result = {
                    status: 200,
                    author: author,
                    judul: $(b).find('> div.recommend-comics-title > span').text(),
                    genre: $(b).find('> div.comics-type > span').text().trim(),
                    link: 'https://mangatoon.mobi' + $(b).find('> a').attr('href'),
                    thumbnail: $(b).find('> a > div > img').attr('src')
                }
                hasil.push(result)
                })
                resolve(hasil)
            })
            .catch(reject)
    })
}
const webtoons = (query) => {
    return new Promise((resolve, reject) => {
        axios.get(`https://www.webtoons.com/id/search?keyword=${query}`)
            .then(({
                data
            }) => {
                const $ = cheerio.load(data)
                const hasil = [];
                 $('#content > div.card_wrap.search._searchResult > ul > li ').each(function(a, b) {
                    result = {
                    status: 200,
                    author: author,
                    judul: $(b).find('> a > div > p.subj').text(),
                    like: $(b).find('> a > div > p.grade_area > em').text(),
                    creator: $(b).find('> a > div > p.author').text(),
                    genre: $(b).find('> a > span').text(),
                    thumbnail: $(b).find('> a > img').attr('src'),
                    url: 'https://www.webtoons.com' + $(b).find('> a').attr('href')
                }
                hasil.push(result)
                })
                resolve(hasil)
            })
            .catch(reject)
    })
}
const drakor = (query) => {
    return new Promise((resolve, reject) => {
        axios.get(`https://drakorasia.blog//?s=${query}&post_type=post`)
            .then(({
                data
            }) => {
                const $ = cheerio.load(data)
                const hasil = [];
                 $('#post > div ').each(function(a, b) {
                    result = {
                    status: 200,
                    author: author,
                    judul: $(b).find('> div.title.text-center.absolute.bottom-0.w-full.py-2.pb-4.px-3 > a > h2').text().trim(),
                    years: $(b).find('> div.title.text-center.absolute.bottom-0.w-full.py-2.pb-4.px-3 > div.category.text-gray.font-normal.text-white.text-xs.truncate > a').text(),
                    genre: $(b).find('> div.title.text-center.absolute.bottom-0.w-full.py-2.pb-4.px-3 > div.genrenya.text-center.text-white.text-opacity-75.text-xs.mt-1').text().trim(),
                    thumbnail: $(b).find('> div.thumbnail > a > img').attr('src'),
                    url: $(b).find('> div.title.text-center.absolute.bottom-0.w-full.py-2.pb-4.px-3 > a').attr('href')
                }
                hasil.push(result)
                })
                resolve(hasil)
            })
            .catch(reject)
    })
}
exports.telesticker = async (url) => {
    return new Promise(async (resolve, reject) => {
        packName = url.replace("https://t.me/addstickers/", "")
        data = await axios(`https://api.telegram.org/bot891038791:AAHWB1dQd-vi0IbH2NjKYUk-hqQ8rQuzPD4/getStickerSet?name=${encodeURIComponent(packName)}`, {method: "GET",headers: {"User-Agent": "GoogleBot"}})
        const hasil = []
        for (let i = 0; i < data.data.result.stickers.length; i++) {
            fileId = data.data.result.stickers[i].thumb.file_id
            data2 = await axios(`https://api.telegram.org/bot891038791:AAHWB1dQd-vi0IbH2NjKYUk-hqQ8rQuzPD4/getFile?file_id=${fileId}`)
            result = {
            status: 200,
            author: author,
            url: "https://api.telegram.org/file/bot891038791:AAHWB1dQd-vi0IbH2NjKYUk-hqQ8rQuzPD4/" + data2.data.result.file_path
            }
            hasil.push(result)
        }
    resolve(hasil)
    })
}
const stickersearch = (query) => {
    return new Promise((resolve, reject) => {
        axios.get(`https://getstickerpack.com/stickers?query=${query}`)
            .then(({
                data
            }) => {
                const $ = cheerio.load(data)
                const source = [];
                const link = [];
                $('#stickerPacks > div > div:nth-child(3) > div > a').each(function(a, b) {
                    source.push($(b).attr('href'))
                })
                axios.get(source[Math.floor(Math.random() * source.length)])
                    .then(({
                        data
                    }) => {
                        const $$ = cheerio.load(data)
                        $$('#stickerPack > div > div.row > div > img').each(function(c, d) {
                            link.push($$(d).attr('src').replace(/&d=200x200/g,''))
                        })
                        result = {
                            status: 200,
                            author: author,
                            title: $$('#intro > div > div > h1').text(),
                            sticker_url: link
                        }
                        resolve(result)
                    })
            }).catch(reject)
    })
}
const listsurah = () => {
            return new Promise((resolve, reject) => {
                  axios.get('https://litequran.net/')
                  .then(({ data }) => {
                       const $ = cheerio.load(data)
                       let listsurah = []
                       $('body > main > section > ol > li > a').each(function(a, b) {
                    listsurah.push($(b).text())
                })
                       result = {
                        status: 200,
                        author: author,
                        listsurah: listsurah
                       }
                       resolve(result)
                  }).catch(reject)
             })
        }
const surah = (query) => {
    return new Promise((resolve, reject) => {
        axios.get(`https://litequran.net/${query}`)
            .then(({
                data
            }) => {
                const $ = cheerio.load(data)
                const hasil = []
                $('body > main > article > ol > li').each(function(a, b) {
                    result = {
                    status: 200,
                    author: author,
                    arab: $(b).find('> span.ayat').text(),
                    latin: $(b).find('> span.bacaan').text(),
                    translate: $(b).find('> span.arti').text()
                }
                hasil.push(result)
                })
                resolve(hasil)
            })
            .catch(reject)
    })
}
const tafsirsurah = (query) => {
    return new Promise((resolve, reject) => {
        axios.get(`https://tafsirq.com/topik/${query}`)
            .then(({
                data
            }) => {
                const $ = cheerio.load(data)
                const hasil = []
                $('body > div:nth-child(4) > div > div.col-md-6 > div ').each(function(a, b) {
                    result = {
                    status: 200,
                    author: author,
                    surah: $(b).find('> div.panel-heading.panel-choco > div > div > a').text(),
                    tafsir: $(b).find('> div.panel-body.excerpt').text().trim(),
                    type: $(b).find('> div.panel-heading.panel-choco > div > div > span').text(),
                    source: $(b).find('> div.panel-heading.panel-choco > div > div > a').attr('href')
                }
                hasil.push(result)
                })
                resolve(hasil)
            })
            .catch(reject)
    })
}
const downloader = async (url) => {
    return new Promise((resolve, reject) => {
        axios({url: 'https://aiovideodl.ml/',method: 'GET',headers: {"user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36","cookie": "PHPSESSID=3893d5f173e91261118a1d8b2dc985c3; _ga=GA1.2.792478743.1635388171;"}}).then((data) => {
            let a = cheerio.load(data.data)
            let token = a('#token').attr('value')
            const options = {
                method: 'POST',
                url: `https://aiovideodl.ml/wp-json/aio-dl/video-data/`,
                headers: {"content-type": "application/x-www-form-urlencoded; charset=UTF-8","user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36","cookie": "PHPSESSID=3893d5f173e91261118a1d8b2dc985c3; _ga=GA1.2.792478743.1635388171;"
                },
                formData: {url: url,token: token}
            };
            request(options, async function(error, response, body) {
                if (error) throw new Error(error)
                res = JSON.parse(body)
                res.status = 200
                res.author = author
                resolve(res);
            });
        })
    })
}
const pinterest = (query) => {
    return new Promise((resolve, reject) => {
         axios(`https://www.pinterest.com/resource/BaseSearchResource/get/?source_url=%2Fsearch%2Fpins%2F%3Fq%3D${query}&data=%7B%22options%22%3A%7B%22isPrefetch%22%3Afalse%2C%22query%22%3A%22${query}%22%2C%22scope%22%3A%22pins%22%2C%22no_fetch_context_on_resource%22%3Afalse%7D%2C%22context%22%3A%7B%7D%7D&_=1619980301559`).then((data) => {
                const random = data.data.resource_response.data.results[Math.floor(Math.random() * (data.data.resource_response.data.results.length))]
                var result = [];
                result = {
                        status: 200,
                        author: author,
                        url: random.images.orig.url
                }
                resolve(result)
            }).catch(reject)
        })
    }
const kompasnews = () => {
    return new Promise((resolve, reject) => {
        axios.get(`https://news.kompas.com/`)
            .then(({
                data
            }) => {
                const $ = cheerio.load(data)
                const hasil = [];
                 $('body > div > div.container.clearfix > div:nth-child(3) > div.col-bs10-7 > div:nth-child(3) > div.latest.ga--latest.mt2.clearfix > div > div ').each(function(a, b) {
                    result = {
                    status: 200,
                    author: author,
                    berita: $(b).find('> div > div.article__box > h3').text(),
                    upload_time: $(b).find('> div > div.article__box > div.article__date').text(),
                    type_berita: $(b).find('> div > div.article__boxsubtitle > h2').text(),
                    link: $(b).find('> div > div.article__box > h3 > a').attr('href'),
                    thumbnail: $(b).find('> div > div.article__asset > a > img').attr('data-src'),
                    info_berita: $(b).find('> div > div.article__box > div.article__lead').text()
                }
                hasil.push(result)
                })
                resolve(hasil)
            })
            .catch(reject)
    })
}


const covid = async (negara) => {
const res = await axios.get(`https://www.worldometers.info/coronavirus/country/${negara}/`) 
const $ = cheerio.load(res.data)
hasil = {}
a = $('div#maincounter-wrap')
hasil.author = author
hasil.status = res.status
hasil.kasus = $(a).find('div > span').eq(0).text()
hasil.kematian = $(a).find('div > span').eq(1).text() 
hasil.sembuh = $(a).find('div > span').eq(2).text() 
return hasil
}



exports.MangaToon = async (judul) => {
    try {
        const link = await axios.get(`https://mangatoon.mobi/id/search?word=${judul}`) 
        const c = cheerio.load(link.data)
        let id = c('#page-content').find('div.search-page > div > div.comics-result > div.recommended-wrap > div > div > a').attr('href') || 'undefined'
        if(id === 'undefined') {
            const link2 = await axios.get(`https://mangatoon.mobi/en/search?word=${judul}`)
            const C = cheerio.load(link2.data)
            let id2 = C('#page-content').find('div.search-page > div > div.comics-result > div.recommended-wrap > div > div:nth-child(1) > a').attr('href')
            const data = await axios.get(`https://mangatoon.mobi${id2}`)
            const $ = cheerio.load(data.data)
            var judul = $('#page-content').find('div.detail-wrap > div.detail-top-info > div.detail-info > div.detail-title-bg > span').text().trim()
            var genre = $('#page-content').find('div.detail-wrap > div.detail-top-info > div.detail-info > div.detail-tags-info > span').text().trim()
            var author = $('#page-content').find('div.detail-wrap > div.detail-top-info > div.detail-info > div.detail-author-name > span').text().trim()
            var thumb = $('#page-content').find('div.detail-wrap > div.detail-top-info > div.detail-img > img.big-img').attr('src');
            var LinkKe = $('#page-content').find('div.detail-wrap > div.detail-interact > a').attr('href')
            var Link = `https://mangatoon.mobi${LinkKe}`
            let Author = author.replace('Nama Author: ', '');
            let hasil = {
                judul, thumb, genre, Author, Link
            }
            return hasil
        } else {
        const data = await axios.get(`https://mangatoon.mobi${id}`)
        const $ = cheerio.load(data.data)
        var judul = $('#page-content').find('div.detail-wrap > div.detail-top-info > div.detail-info > div.detail-title-bg > span').text().trim()
        var genre = $('#page-content').find('div.detail-wrap > div.detail-top-info > div.detail-info > div.detail-tags-info > span').text().trim()
        var author = $('#page-content').find('div.detail-wrap > div.detail-top-info > div.detail-info > div.detail-author-name > span').text().trim()
        var thumb = $('#page-content').find('div.detail-wrap > div.detail-top-info > div.detail-img > img.big-img').attr('src');
        var LinkKe = $('#page-content').find('div.detail-wrap > div.detail-interact > a').attr('href')
        var Link = `https://mangatoon.mobi${LinkKe}`
        let Author = author.replace('Nama Author: ', '');
        let hasil = {
            status: 200,
            author : '@dandsubhani_',
            judul, thumb, genre, Author, Link
        }
        return hasil
    }
        } catch (err) {
            return `Not Found 404`
        }
}

async function RandomCerpen() {
    try{
    const link = await axios.get(`http://cerpenmu.com/`)
    const c = cheerio.load(link.data)
    let kumpulan = []
    c('#sidebar > div').each(function (real, ra) {
        c(ra).find('ul > li').each(function (i, rayy) {
            let random = c(rayy).find('a').attr('href')
            kumpulan.push(random)
        })
    })
    var acak = kumpulan[Math.floor(Math.random() * (kumpulan.length))]
    let Otw = await axios.get(`${acak}`)
    const C = cheerio.load(Otw.data)
    let otw = []
    C('#content > article > article').each(function (a, b) {
        let random = C(b).find('h2 > a').attr('href')
        otw.push(random)
    })
    var Acak = otw[Math.floor(Math.random() * (otw.length))]
    let Link = await axios.get(`${Acak}`)
    let $ = cheerio.load(Link.data)
    let judul = $('#content').find('article > h1').text().trim()
    let karangan = $('#content').find('article > a:nth-child(2)').text().trim()
    let Isi = []
    $('#content > article > p').each(function (wm, Ra) {
        let isi = $(Ra).text().trim()
        Isi.push(isi)

    })
    let cerita = []
    for (let i of Isi) {
        cerita += i
    }
    const data = {
        status: 200,
        author: author,
        result: {
            Judul: judul,
            Penulis: karangan,
            sumber: Acak,
            cerita: cerita
        }
    }
    return data
} catch (err) {
    const res404 = {
        status: 500,
        author: author,
        Pesan: 'Emrorr'
    }
    return res404
}
}

async function Wikipedia(querry) {
    try {
    const link =  await axios.get(`https://id.wikipedia.org/wiki/${querry}`)
    const $ = cheerio.load(link.data)
    let judul = $('#firstHeading').text().trim()
    let thumb = $('#mw-content-text').find('div.mw-parser-output > div:nth-child(1) > table > tbody > tr:nth-child(2) > td > a > img').attr('src') || `//i.ibb.co/nzqPBpC/http-error-404-not-found.png`
    let isi = []
    $('#mw-content-text > div.mw-parser-output').each(function (rayy, Ra) {
        let penjelasan = $(Ra).find('p').text().trim()
        isi.push(penjelasan)
    })
    for(let i of isi) {
    const data = {
        author: author,
        status: link.status,
        result: {
            judul: judul,
            thumb: 'https:'+thumb,
            isi: i
        }
    }
    return data
}
    } catch (err) {
        var notFond = {
            author: author,
            status: link.status,
            Pesan: 'Emrorr'
        }
        return notFond
    }
}


exports.TrendTwit = (country) => {
    return new Promise((resolve,reject) => {
        axios.get(`https://getdaytrends.com/${country}/`)
        .then(({ data }) => {
            const $ = cheerio.load(data)
            const hastag = [];
      const tweet = [];
      const result = [];
      $('#trends > table.table.table-hover.text-left.clickable.ranking.trends.wider.mb-0 > tbody > tr> td.main > a').each(function(a, b){
        deta = $(b).text()
        hastag.push(deta)
      })
      $('#trends > table.table.table-hover.text-left.clickable.ranking.trends.wider.mb-0 > tbody > tr > td.main > div > span').each(function(a, b){
        deta = $(b).text()
        tweet.push(deta)
      })
      num = 1
      for(let i=0; i<hastag.length; i++){
        result.push({
          rank: num,
          hastag: hastag[i],
          tweet: tweet[i]
        })
        num += 1
      }
            resolve({
          country: country,
          result: result
        })
        })
        .catch(reject)
    })
}

exports.mediafireDl = async (url) => {
async function getMime(links) {
bufs = await require('node-fetch')(links).then(v => v.buffer())
hsil = await require('file-type').fromBuffer(bufs)
return hsil
}
const res = await axios.get(url) 
const $ = cheerio.load(res.data)
const hasil = []
const link = $('a#downloadButton').attr('href')
const size = $('a#downloadButton').text().replace('Download', '').replace('(', '').replace(')', '').replace('\n', '').replace('\n', '').replace('                         ', '')
const seplit = link.split('/')
const nama = seplit[5]
hasil.push({ status: 200, author: author, nama, size, link })
return hasil[0]
}

exports.Pinterest = async(querry) => {
    return new Promise(async(resolve,reject) => {
         axios.get('https://id.pinterest.com/search/pins/?autologin=true&q=' + querry, {
            headers: {
            "cookie" : "_auth=1; _b=\"AVna7S1p7l1C5I9u0+nR3YzijpvXOPc6d09SyCzO+DcwpersQH36SmGiYfymBKhZcGg=\"; _pinterest_sess=TWc9PSZHamJOZ0JobUFiSEpSN3Z4a2NsMk9wZ3gxL1NSc2k2NkFLaUw5bVY5cXR5alZHR0gxY2h2MVZDZlNQalNpUUJFRVR5L3NlYy9JZkthekp3bHo5bXFuaFZzVHJFMnkrR3lTbm56U3YvQXBBTW96VUgzVUhuK1Z4VURGKzczUi9hNHdDeTJ5Y2pBTmxhc2owZ2hkSGlDemtUSnYvVXh5dDNkaDN3TjZCTk8ycTdHRHVsOFg2b2NQWCtpOWxqeDNjNkk3cS85MkhhSklSb0hwTnZvZVFyZmJEUllwbG9UVnpCYVNTRzZxOXNJcmduOVc4aURtM3NtRFo3STlmWjJvSjlWTU5ITzg0VUg1NGhOTEZzME9SNFNhVWJRWjRJK3pGMFA4Q3UvcHBnWHdaYXZpa2FUNkx6Z3RNQjEzTFJEOHZoaHRvazc1c1UrYlRuUmdKcDg3ZEY4cjNtZlBLRTRBZjNYK0lPTXZJTzQ5dU8ybDdVS015bWJKT0tjTWYyRlBzclpiamdsNmtpeUZnRjlwVGJXUmdOMXdTUkFHRWloVjBMR0JlTE5YcmhxVHdoNzFHbDZ0YmFHZ1VLQXU1QnpkM1FqUTNMTnhYb3VKeDVGbnhNSkdkNXFSMXQybjRGL3pyZXRLR0ZTc0xHZ0JvbTJCNnAzQzE0cW1WTndIK0trY05HV1gxS09NRktadnFCSDR2YzBoWmRiUGZiWXFQNjcwWmZhaDZQRm1UbzNxc21pV1p5WDlabm1UWGQzanc1SGlrZXB1bDVDWXQvUis3elN2SVFDbm1DSVE5Z0d4YW1sa2hsSkZJb1h0MTFpck5BdDR0d0lZOW1Pa2RDVzNySWpXWmUwOUFhQmFSVUpaOFQ3WlhOQldNMkExeDIvMjZHeXdnNjdMYWdiQUhUSEFBUlhUVTdBMThRRmh1ekJMYWZ2YTJkNlg0cmFCdnU2WEpwcXlPOVZYcGNhNkZDd051S3lGZmo0eHV0ZE42NW8xRm5aRWpoQnNKNnNlSGFad1MzOHNkdWtER0xQTFN5Z3lmRERsZnZWWE5CZEJneVRlMDd2VmNPMjloK0g5eCswZUVJTS9CRkFweHc5RUh6K1JocGN6clc1JmZtL3JhRE1sc0NMTFlpMVErRGtPcllvTGdldz0=; _ir=0"
        }
            }).then(({ data }) => {
        const $ = cheerio.load(data)
        const result = [];
        const hasil = [];
         $('div > a').get().map(b => {
        const link = $(b).find('img').attr('src')
            result.push(link)
        });
        result.forEach(v => {
         if(v == undefined) return
         hasil.push(v.replace(/236/g,'736'))
            })
            hasil.shift();
        resolve(hasil)
        })
    })
}



async function Emoji(emoticon) {
    const emojii = encodeURI(`${emoticon}`)
    const link = await axios.get(`https://emojipedia.org/${emojii}/`)
    const $ = cheerio.load(link.data)
    var apple = $('body > div.container > div.content').find('article > section.vendor-list > ul > li:nth-child(1) > div.vendor-container.vendor-rollout-target > div.vendor-image > img').attr('src');
    var google = $('body > div.container > div.content').find('article > section.vendor-list > ul > li:nth-child(2) > div.vendor-container.vendor-rollout-target > div.vendor-image > img').attr('src');
    var samsung = $('body > div.container > div.content').find('article > section.vendor-list > ul > li:nth-child(3) > div.vendor-container.vendor-rollout-target > div.vendor-image > img').attr('src');
    var microsoft = $('body > div.container > div.content').find('article > section.vendor-list > ul > li:nth-child(4) > div.vendor-container.vendor-rollout-target > div.vendor-image > img').attr('src');
    var whatsapp = $('body > div.container > div.content').find('article > section.vendor-list > ul > li:nth-child(5) > div.vendor-container.vendor-rollout-target > div.vendor-image > img').attr('src');
    var twitter = $('body > div.container > div.content').find('article > section.vendor-list > ul > li:nth-child(6) > div.vendor-container.vendor-rollout-target > div.vendor-image > img').attr('src');
    var facebook = $('body > div.container > div.content').find('article > section.vendor-list > ul > li:nth-child(7) > div.vendor-container.vendor-rollout-target > div.vendor-image > img').attr('src');
    var jooxpixel = $('body > div.container > div.content').find('article > section.vendor-list > ul > li:nth-child(8) > div.vendor-container.vendor-rollout-target > div.vendor-image > img').attr('src');
    var openmoji = $('body > div.container > div.content').find('article > section.vendor-list > ul > li:nth-child(9) > div.vendor-container.vendor-rollout-target > div.vendor-image > img').attr('src');
    var emojidex = $('body > div.container > div.content').find('article > section.vendor-list > ul > li:nth-child(10) > div.vendor-container.vendor-rollout-target > div.vendor-image > img').attr('src');
    var messager = $('body > div.container > div.content').find('article > section.vendor-list > ul > li:nth-child(11) > div.vendor-container.vendor-rollout-target > div.vendor-image > img').attr('src');
    var LG = $('body > div.container > div.content').find('article > section.vendor-list > ul > li:nth-child(12) > div.vendor-container.vendor-rollout-target > div.vendor-image > img').attr('src');
    var HTC = $('body > div.container > div.content').find('article > section.vendor-list > ul > li:nth-child(13) > div.vendor-container.vendor-rollout-target > div.vendor-image > img').attr('src');
    var mozilla = $('body > div.container > div.content').find('article > section.vendor-list > ul > li:nth-child(14) > div.vendor-container.vendor-rollout-target > div.vendor-image > img').attr('src');
    var softbank = $('body > div.container > div.content').find('article > section.vendor-list > ul > li:nth-child(15) > div.vendor-container.vendor-rollout-target > div.vendor-image > img').attr('src');
    var docomo = $('body > div.container > div.content').find('article > section.vendor-list > ul > li:nth-child(16) > div.vendor-container.vendor-rollout-target > div.vendor-image > img').attr('src');
    var KDDI = $('body > div.container > div.content').find('article > section.vendor-list > ul > li:nth-child(17) > div.vendor-container.vendor-rollout-target > div.vendor-image > img').attr('src');
    const result = {
        status: 200,
        author: author,
        apple: apple.replace('120', '240'),
        google: google.replace('120', '240'),
        samsung: samsung.replace('120', '240'),
        microsoft: microsoft.replace('120', '240'),
        whatsapp: whatsapp.replace('120', '240'),
        twitter: twitter.replace('120', '240'),
        facebook: facebook.replace('120', '240'),
        jooxPixel: jooxpixel.replace('120', '240'),
        openemoji: openmoji.replace('120', '240'),
        emojidex: emojidex.replace('120', '240'),
        messanger: messager.replace('120', '240'),
        LG: LG.replace('120', '240'),
        HTC: HTC.replace('120', '240'),
        mozilla: mozilla.replace('120', '240'),
        softbank: softbank.replace('120', '240'),
        docomo: docomo.replace('120', '240'),
        KDDI: KDDI.replace('120', '240')
    }
    return result
}



async function Gempa() {
    try{
    const link = await axios.get(`https://www.bmkg.go.id/gempabumi/gempabumi-dirasakan.bmkg`)
    const $ = cheerio.load(link.data)
    let hasil = []
    $('body > div.wrapper > div.container.content > div > div.col-md-8 > div > div > table > tbody').each(function (a, b) {
        $(b).find('tr').each(function (c, d) {
            let tanggal = $(d).find('td:nth-child(2)').text().trim()
            let koordinat = $(d).find('td:nth-child(3)').text().trim()
            let magnitudo = $(d).find('td:nth-child(4)').text().trim()
            let kedalaman = $(d).find('td:nth-child(5)').text().trim()
            let skala = $(d).find('td:nth-child(6) > a').text().trim()
            const data = {
                author: author,
                status: link.status,
                result: {
                    tanggal: tanggal,
                    koordinat: koordinat,
                    getaran: magnitudo,
                    kedalaman: kedalaman,
                    skala: skala
                }
            }
            hasil.push(data)
        })
    })
    return hasil
} catch (err) {
    var notFond = {
        author: author,
        status: link.status,
        Pesan: 'ERROR'
    }
    return notFond
}
}

async function GSMArena(querry) {
    const link = await axios.get(`https://www.gsmarena.com/res.php3?sSearch=${querry}`)
    const ch = cheerio.load(link.data)
    let Url = ch('#review-body > div > ul').find('li:nth-child(1) > a').attr('href')
    const Link = await axios.get(`https://www.gsmarena.com/${Url}`)
    let $ = cheerio.load(Link.data)
    let barang = $('#body > div > div.review-header > div').find(' div.article-info-line.page-specs.light.border-bottom > h1').text().trim()
    let rilis = $('#body > div > div.review-header > div').find('div.center-stage.light.nobg.specs-accent > ul > li.specs-brief.pattern > span:nth-child(1) > span').text().trim()
    let thumb = $('#body > div > div.review-header > div').find('div.center-stage.light.nobg.specs-accent > div > a > img').attr('src')
    let ukuran = $('#body > div > div.review-header > div').find('div.center-stage.light.nobg.specs-accent > ul > li.specs-brief.pattern > span:nth-child(3) > span').text().trim()
    let tipe = $('#body > div > div.review-header > div').find('div.center-stage.light.nobg.specs-accent > ul > li.specs-brief.pattern > span:nth-child(5) > span').text().trim()
    let storage = $('#body > div > div.review-header > div').find('div.center-stage.light.nobg.specs-accent > ul > li.specs-brief.pattern > span:nth-child(7) > span').text().trim()
    let display = $('#body > div > div.review-header > div').find('div.center-stage.light.nobg.specs-accent > ul > li.help.accented.help-display > div').text().trim()
    let inchi = $('#body > div > div.review-header > div').find('div.center-stage.light.nobg.specs-accent > ul > li.help.accented.help-display > strong > span').text().trim()
    let camPix = $('#body > div > div.review-header > div').find('div.center-stage.light.nobg.specs-accent > ul > li.help.accented.help-camera > strong > span:nth-child(1)').text().trim()
    let Mp = $('#body > div > div.review-header > div').find('div.center-stage.light.nobg.specs-accent > ul > li.help.accented.help-camera > strong > span:nth-child(2)').text().trim()
    let VideoVix = $('#body > div > div.review-header > div').find('div.center-stage.light.nobg.specs-accent > ul > li.help.accented.help-camera > div').text().trim()
    let Ram = $('#body > div > div.review-header > div').find('div.center-stage.light.nobg.specs-accent > ul > li.help.accented.help-expansion > strong > span:nth-child(2)').text().trim()
    let chipset = $('#body > div > div.review-header > div').find('div.center-stage.light.nobg.specs-accent > ul > li.help.accented.help-expansion > div').text().trim()
    let batre = $('#body > div > div.review-header > div').find('div.center-stage.light.nobg.specs-accent > ul > li.help.accented.help-battery > strong > span:nth-child(1)').text().trim()
    let Mah = $('#body > div > div.review-header > div').find('div.center-stage.light.nobg.specs-accent > ul > li.help.accented.help-battery > strong > span:nth-child(2)').text().trim()
    let merekBatre = $('#body > div > div.review-header > div').find('div.center-stage.light.nobg.specs-accent > ul > li.help.accented.help-battery > div').text().trim()
    let AngkaRam = $('#body > div > div.review-header > div').find('div.center-stage.light.nobg.specs-accent > ul > li.help.accented.help-expansion > strong > span:nth-child(1)').text().trim()
    let detail = []
    $('#specs-list').each(function (anu, RA) {
        let isi = $(RA).text().trim()
        detail.push(isi)
    })
    const result = {
        status: Link.status,
        author: author,
        result: {
            judul: barang,
            rilis: rilis,
            thumb: thumb,
            ukuran: ukuran,
            type: tipe,
            storage: storage,
            display: display,
            inchi: inchi,
            pixel: camPix + Mp,
            videoPixel: VideoVix,
            ram: AngkaRam + Ram,
            chipset: chipset,
            batrai: batre + Mah,
            merek_batre: merekBatre,
            detail: detail[0]
        }
    }
    return result
}

async function Shoope(item, limit) {
    const hasil = []
    await axios.request(`https://shopee.co.id/api/v4/search/search_items?by=relevancy&keyword=${item}&limit=${limit}&newest=0&order=desc&page_type=search&scenario=PAGE_GLOBAL_SEARCH&version=2`, {
        method: "GET",
        data: null,
        headers: {
            "accept": "*/*",
            "accept-language": "en-US,en;q=0.9,id;q=0.8",
            "if-none-match-": "55b03-856cd63f16112f8a43da6096f97ac3fe",
            "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"90\", \"Google Chrome\";v=\"90\"",
        }
    }).then(respon => {
        hasil.push(respon.data)
    })
    return hasil[0]
}

exports.IgStalk = async(username) => {
    return new Promise(async(resolve, reject) => {
    let {data} = await axios('https://www.instagram.com/'+username+'/?__a=1', {
        'method': 'GET',
        'headers': {
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.159 Safari/537.36',
        'cookie': 'ig_did=77ADA31F-4AB0-4D19-8875-522C891A60E6; ig_nrcb=1; csrftoken=Zuy4R9169ejQY0R20InUOfeh2fCh7cfW; ds_user_id=8779859677; sessionid=8779859677%3Az2RfuCb1tsxTh1%3A26; shbid="10275\0548779859677\0541665541164:01f7683f87e5d1e3c2db8b41bfad455d2718c549ac0aeba033c00ae0e25647a7d8b87ee1"; shbts="1634005164\0548779859677\0541665541164:01f7df3ebca9d4ae3ecdb5f3b25d845142e5f462409976c5c140ba803c85bdd15fe0d45e"; rur="EAG\0548779859677\0541665541186:01f7c8bdbba6bfaf1f0fc03d5b843fe864bb908dc49069cc77dd546a9c6b50302d83b608"'
        }
    })
    let user = data.graphql.user
    let json = {
        creator: author,
        status: 'ok',
        code: 200,
        username: user.username,
        fullname: user.full_name,
        verified: user.is_verified,
        video_count_reel: user.highlight_reel_count,
        followers: user.edge_followed_by.count,
        follow: user.edge_follow.count,
        is_bussines: user.is_business_account,
        is_professional: user.is_professional_account,
        category: user.category_name,
        thumbnail: user.profile_pic_url_hd,
        bio: user.biography,
        info_account: data.seo_category_infos
    }
    resolve(json)
})
}

exports.igdl = async (link) => {
    return new Promise((resolve, reject) => {
        const options = {
            method: 'POST',
            url: "https://downloadgram.org/#downloadhere",
            headers: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            formData: {
                url: link,
                submit: ''
            }
        };
        request(options, async function(error, response, body) {
            if (error) throw new Error(error);
            const $ = cheerio.load(body)
            const result = [];
            $('#downloadBox > a').each(function(a, b) {
                result.push($(b).attr('href'))
            })
            let jos = {
                status: 200,
                creator: author,
                result: {
                    result
                }
            }
            resolve(jos);
        });
    })
}

exports.ResepSearch = async(query) => {
            return new Promise(async(resolve,reject) => {
                axios.get('https://resepkoki.id/?s=' + query)
                .then(({ data }) => {
                        const $ = cheerio.load(data)
                        const link = [];
                        const judul = [];
                        const upload_date = [];
                        const format = [];
                        const thumb = [];
                        $('body > div.all-wrapper.with-animations > div:nth-child(5) > div > div.archive-posts.masonry-grid-w.per-row-2 > div.masonry-grid > div > article > div > div.archive-item-media > a').each(function(a,b){
                            link.push($(b).attr('href'))
                        })
                        $('body > div.all-wrapper.with-animations > div:nth-child(5) > div > div.archive-posts.masonry-grid-w.per-row-2 > div.masonry-grid > div > article > div > div.archive-item-content > header > h3 > a').each(function(c,d){
                            jud = $(d).text();
                            judul.push(jud)
                        })
                        for( let i = 0; i < link.length; i++){
                            format.push({
                                judul : judul[i],
                                link : link[i]
                            })
                        }
                        const result = {
                            creator: author,
                            data : format
                        }
                  resolve(result)
            })
                .catch(reject)
            })
}
exports.ReadResep = async(query) => {
            return new Promise(async(resolve,reject) => {
                axios.get(query)
                .then(({ data }) => {
                        const $ = cheerio.load(data)
                        const abahan = [];
                        const atakaran = [];
                        const atahap = [];
                        $('body > div.all-wrapper.with-animations > div.single-panel.os-container > div.single-panel-details > div > div.single-recipe-ingredients-nutritions > div > table > tbody > tr > td:nth-child(2) > span.ingredient-name').each(function(a,b) {
                            bh = $(b).text();
                            abahan.push(bh)
                        })
                        $('body > div.all-wrapper.with-animations > div.single-panel.os-container > div.single-panel-details > div > div.single-recipe-ingredients-nutritions > div > table > tbody > tr > td:nth-child(2) > span.ingredient-amount').each(function(c,d) {
                            uk = $(d).text();
                            atakaran.push(uk)
                        })
                        $('body > div.all-wrapper.with-animations > div.single-panel.os-container > div.single-panel-main > div.single-content > div.single-steps > table > tbody > tr > td.single-step-description > div > p').each(function(e,f) {
                            th = $(f).text();
                            atahap.push(th)
                        })
                        const judul = $('body > div.all-wrapper.with-animations > div.single-panel.os-container > div.single-title.title-hide-in-desktop > h1').text();
                        const waktu = $('body > div.all-wrapper.with-animations > div.single-panel.os-container > div.single-panel-main > div.single-meta > ul > li.single-meta-cooking-time > span').text();
                        const hasil = $('body > div.all-wrapper.with-animations > div.single-panel.os-container > div.single-panel-main > div.single-meta > ul > li.single-meta-serves > span').text().split(': ')[1]
                        const level = $('body > div.all-wrapper.with-animations > div.single-panel.os-container > div.single-panel-main > div.single-meta > ul > li.single-meta-difficulty > span').text().split(': ')[1]
                        const thumb = $('body > div.all-wrapper.with-animations > div.single-panel.os-container > div.single-panel-details > div > div.single-main-media > img').attr('src')
                        tbahan = 'bahan\n'
                        for( let i = 0; i < abahan.length; i++){
                            tbahan += abahan[i] + ' ' + atakaran[i] + '\n' 
                        }
                        ttahap = 'tahap\n'
                        for( let i = 0; i < atahap.length; i++){
                            ttahap += atahap[i] + '\n\n' 
                        }
                        const tahap = ttahap
                        const bahan = tbahan
                        const result = {
                            creator : author,
                            data : {
                                judul : judul,
                                waktu_masak : waktu,
                                hasil : hasil,
                                tingkat_kesulitan : level,
                                thumb : thumb,
                                bahan : bahan.split('bahan\n')[1],
                                langkah_langkah : tahap.split('tahap\n')[1]
                            }
                        }
                  resolve(result)
            })
                .catch(reject)
            })
}

exports.Goredl = async(link) => {
            return new Promise(async(resolve,reject) => {
            axios.get(link)
                        .then(({ data }) => {
                            const $$ = cheerio.load(data)
                            const format = {
                                judul : $$('div.single-main-container > div > div.bb-col.col-content > div > div > div > div > header > h1').text(),
                                views : $$('div.single-main-container > div > div.bb-col.col-content > div > div > div > div > div.s-post-meta-block.bb-mb-el > div > div > div.col-r.d-table-cell.col-md-6.col-sm-6.text-right-sm > div > span > span.count').text(),
                                comment : $$('div.single-main-container > div > div.bb-col.col-content > div > div > div > div > div.s-post-meta-block.bb-mb-el > div > div > div.col-r.d-table-cell.col-md-6.col-sm-6.text-right-sm > div > a > span.count').text(),
                                link : $$('video > source').attr('src')
                            }
                            const result = {
                                creator: author,
                                data : format
                            }
                  resolve(result)
                })
                .catch(reject)
            })
}

exports.SearchGore = async(query) => {
            return new Promise(async(resolve,reject) => {
                axios.get('https://seegore.com/?s=' + query).then(dataa => {
                    const $$$ = cheerio.load(dataa)
                    pagina = $$$('#main > div.container.main-container > div > div.bb-col.col-content > div > div > div > div > nav > ul > li:nth-child(4) > a').text();    
                rand = Math.floor(Math.random() * pagina) + 1
                if(rand === 1){
                    slink = 'https://seegore.com/?s=' + query
                }else{
                    slink = `https://seegore.com/page/${rand}/?s=${query}` 
                }
                axios.get(slink)
                .then(({ data }) => {
                        const $ = cheerio.load(data)
                        const link = [];
                        const judul = [];
                        const uploader = [];
                        const format = [];
                        const thumb = [];
                        $('#post-items > li > article > div.content > header > h2 > a').each(function(a,b){
                            link.push($(b).attr('href'))
                        })
                        $('#post-items > li > article > div.content > header > h2 > a').each(function(c,d){
                            jud = $(d).text();
                            judul.push(jud)
                        })
                        $('#post-items > li > article > div.content > header > div > div.bb-cat-links > a').each(function(e,f){
                            upl = $(f).text();
                            uploader.push(upl)
                        })
                        $('#post-items > li > article > div.post-thumbnail > a > div > img').each(function(g,h){
                            thumb.push($(h).attr('src'))
                        })
                        for( let i = 0; i < link.length; i++){
                            format.push({
                                judul : judul[i],
                                uploader : uploader[i],
                                thumb : thumb[i],
                                link : link[i]
                            })
                        }
                        const result = {
                            creator: author,
                            data : format
                        }
                  resolve(result)
            })
                .catch(reject)
            })
            })
}
exports.RandomGore = async() => {
            return new Promise(async(resolve,reject) => {
                axios.get('https://seegore.com/gore/').then(dataa => {
                    const $$$ = cheerio.load(dataa)
                    pagina = $$$('#main > div.container.main-container.bb-stretched-full > div > div > div > div > div > div > nav > ul > li:nth-child(4) > a').text(); 
                rand = Math.floor(Math.random() * pagina) + 1
                randvid = Math.floor(Math.random() * 16) + 1
                if(rand === 1){
                    slink = 'https://seegore.com/gore/'
                }else{
                    slink = `https://seegore.com/gore/page/${rand}/` 
                }
                axios.get(slink)
                .then(({ data }) => {
                        const $ = cheerio.load(data)
                        const link = [];
                        const result = [];
                        const username = [];
                        const linkp = $(`#post-items > li:nth-child(${randvid}) > article > div.post-thumbnail > a`).attr('href')
                        const thumbb = $(`#post-items > li:nth-child(${randvid}) > article > div.post-thumbnail > a > div > img`).attr('src')
                        axios.get(linkp)
                        .then(({ data }) => {
                            const $$ = cheerio.load(data)
                            const format = {
                                judul : $$('div.single-main-container > div > div.bb-col.col-content > div > div > div > div > header > h1').text(),
                                views : $$('div.single-main-container > div > div.bb-col.col-content > div > div > div > div > div.s-post-meta-block.bb-mb-el > div > div > div.col-r.d-table-cell.col-md-6.col-sm-6.text-right-sm > div > span > span.count').text(),
                                comment : $$('div.single-main-container > div > div.bb-col.col-content > div > div > div > div > div.s-post-meta-block.bb-mb-el > div > div > div.col-r.d-table-cell.col-md-6.col-sm-6.text-right-sm > div > a > span.count').text(),
                                thumb : thumbb,
                                link : $$('video > source').attr('src')
                            }
                            const result = {
                                creator: author,
                                data : format
                            }
                  resolve(result)
                })
            })
                .catch(reject)
            })
        })
}


exports.ApkMirror = async(query) => {
        return new Promise((resolve,reject) => {
                axios.get('https://www.apkmirror.com/?post_type=app_release&searchtype=apk&s=' + query)
                .then(({ data }) => {
                        const $ = cheerio.load(data)
                        const nama = [];
                        const developer = [];
                        const lupdate = [];
                        const size = [];
                        const down = [];
                        const version = [];
                        const link = [];
                        const format = [];
                        $('#content > div > div > div.appRow > div > div > div > h5 > a').each(function(a,b) {
                          nem = $(b).text();
                          nama.push(nem)
                        })
                        $('#content > div > div > div.appRow > div > div > div > a').each(function(c,d) {
                          dev = $(d).text();
                          developer.push(dev)
                        })
                        $('#content > div > div > div.appRow > div > div > div > div.downloadIconPositioning > a').each(function(e,f) {
                          link.push('https://www.apkmirror.com' + $(f).attr('href'))
                        })
                        $('#content > div > div > div.infoSlide > p > span.infoslide-value').each(function(g,h) {
                          data = $(h).text();
                          if(data.match('MB')){
                          size.push(data)
                          }
                          else if(data.match('UTC')){
                            lupdate.push(data)
                          }
                          else if(!isNaN(data) || data.match(',')){
                            down.push(data)
                          }
                          else{
                            version.push(data)
                          }
                        })
                        for(let i=0; i<link.length; i++){
                          format.push({
                            judul : nama[i],
                            dev : developer[i],
                            size : size[i],
                            version : version[i],
                            uploaded_on : lupdate[i],
                            download_count : down[i],
                            link : link[i]
                          })
                        }
                       const result = {
                        creator : author,
                        data : format
                       }
                  resolve(result)
                })
                .catch(reject)
        })
}
exports.SfileDown = async(link) => {
        return new Promise((resolve,reject) => {
                axios.get(link)
                .then(({ data }) => {
                        const $ = cheerio.load(data)
                        const nama = $('body > div.w3-row-padding.w3-container.w3-white > div > div:nth-child(2) > b').text();
                        const size = $('#download').text().split('Download File')
                        const desc = $('body > div.w3-row-padding.w3-container.w3-white > div > div:nth-child(7) > center > h1').text();
                        const type = $('body > div.w3-row-padding.w3-container.w3-white > div > div:nth-child(4) > a:nth-child(3)').text();
                        const upload = $('body > div.w3-row-padding.w3-container.w3-white > div > div:nth-child(5)').text();
                        const uploader = $('body > div.w3-row-padding.w3-container.w3-white > div > div:nth-child(4) > a:nth-child(2)').text();
                        const download = $('body > div.w3-row-padding.w3-container.w3-white > div > div:nth-child(6)').text();
                        const link = $('#download').attr('href')
            other = link.split('/')[7].split('&is')[0]
                        const format = {
                          judul: nama + other.substr(other.length - 6).split('.')[1],
                          size: size[1].split('(')[1].split(')')[0],
                          type: type,
              mime: other.substr(other.length - 6).split('.')[1],
                          desc: desc,
                          uploader: uploader,
                          uploaded: upload.split('\n - Uploaded: ')[1],
                          download_count : download.split(' - Downloads: ')[1],
                          link: link
                        }
                        const result = {
                        creator : author,
                        data : format
                       }
                  resolve(result)
                })
                .catch(reject)
        })
}


exports.SfileSearch = (query) => {
        return new Promise((resolve,reject) => {
                axios.get('https://sfile.mobi/search.php?q=' + query + '&search=Search')
                .then(({ data }) => {
                        const $ = cheerio.load(data)
                        const result = [];
                        const link = [];
                        const neme = [];
const size = [];
                        $('div.w3-card.white > div.list > a').each(function(a,b) {
                                link.push($(b).attr('href'))
                        })
                        $('div.w3-card.white > div.list > a').each(function(c,d) {
                                name = $(d).text();
                                neme.push(name)
                                })
      $('div.w3-card.white > div.list').each(function(e,f) {
                                siz = $(f).text();
                               //sz = siz.
        size.push(siz.split('(')[1])
                                })
for(let i=0; i<link.length; i++){
        result.push({
                nama: neme[i],
    size : size[i].split(')')[0],
                link: link[i]
        })
}
                  resolve(result)
                })
                .catch(reject)
        })
}

exports.GrupWA = (nama) => {
    return new Promise((resolve, reject) => {
        axios.get('http://ngarang.com/link-grup-wa/daftar-link-grup-wa.php?search=' + nama + '&searchby=name')
            .then(({
                data
            }) => {
                const $ = cheerio.load(data);
                const result = [];
                const lnk = [];
                const nm = [];
                $('div.wa-chat-title-container').each(function(a, b) {
                    const limk = $(b).find('a').attr('href');
                    lnk.push(limk)
                })
                $('div.wa-chat-title-text').each(function(c, d) {
                    const name = $(d).text();
                    nm.push(name)
                })
                for (let i = 0; i < lnk.length; i++) {
                    result.push({
                        nama: nm[i].split('. ')[1],
                        link: lnk[i].split('?')[0]
                    })
                }
                resolve(result)
            })
            .catch(reject)
    })
}

exports.ArtiNama = (query) => {
    return new Promise((resolve, reject) => {
        queryy = query.replace(/ /g, '+')
        axios.get('https://www.primbon.com/arti_nama.php?nama1=' + query + '&proses=+Submit%21+')
            .then(({
                data
            }) => {
                const $ = cheerio.load(data)
                const result = $('#body').text();
                const result2 = result.split('\n      \n        \n        \n')[0]
                const result4 = result2.split('ARTI NAMA')[1]
                const result5 = result4.split('.\n\n')
                const result6 = result5[0] + '\n\n' + result5[1]
                resolve(result6)
            })
            .catch(reject)
    })
}

exports.wallpaperhd = (chara) => {
    return new Promise((resolve, reject) => {
        axios.get('https://wall.alphacoders.com/search.php?search=' + chara + '&filter=4K+Ultra+HD')
            .then(({
                data
            }) => {
                const $ = cheerio.load(data)
                const result = [];
                $('div.boxgrid > a > picture').each(function(a, b) {
                    result.push($(b).find('img').attr('src').replace('thumbbig-', ''))
                })
                resolve(result)
            })
            .catch(reject)
    })
}


let is = {
    headers: {
        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
        "sec-ch-ua": '" Not;A Brand";v="99", "Google Chrome";v="91", "Chromium";v="91"',
        "cookie": "PHPSESSID=ugpgvu6fgc4592jh7ht9d18v49; _ga=GA1.2.1126798330.1625045680; _gid=GA1.2.1475525047.1625045680; __gads=ID=92b58ed9ed58d147-221917af11ca0021:T=1625045679:RT=1625045679:S=ALNI_MYnQToDW3kOUClBGEzULNjeyAqOtg",
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
    }
}

function _token(host) {
    return new Promise(async (resolve, reject) => {
        axios.request({
            url: host, method: 'GET', headers: {
                "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
                "cookie": "PHPSESSID=ugpgvu6fgc4592jh7ht9d18v49; _ga=GA1.2.1126798330.1625045680; _gid=GA1.2.1475525047.1625045680; __gads=ID=92b58ed9ed58d147-221917af11ca0021:T=1625045679:RT=1625045679:S=ALNI_MYnQToDW3kOUClBGEzULNjeyAqOtg"
            }
        }).then(({ data }) => {
            let $ = cheerio.load(data)
            let token = $('#token').attr('value')
            resolve(token)
        })
    })
}

exports.facebook = (url) => {
    return new Promise(async (resolve, reject) => {
        let host = 'https://aiovideodl.ml/'
        let form = { data: { 'url': url, 'token': (await _token(host)) } }
        axios.post(host + '/system/action.php', qs.stringify(form.data), { headers: is.headers })
            .then(({ data }) => {
                if (data == 'error') return resolve({ creator: '@dandisubhani_', status: false })
                resolve({ creator: '@dandisubhani_', status: true, thumb: data.thumbnail, data: data.links })
            })
    })
}

exports.Facebook = (url) => {
    return new Promise(async (resolve, reject) => {
       try {
          let Go = await fetch('https://fbdownloader.app/id', {
             method: 'GET',
             headers: {
                'User-Agent': 'GoogleBot'
             }
          })
          let isCookie = Go.headers.get('set-cookie').split(',').map((v) => cookie.parse(v)).reduce((a, c) => {
             return {
                ...a,
                ...c
             }
          }, {})
          let isHtml = await Go.text()
          isCookie = {
             '.AspNetCore.Antiforgery.vmpBg8YRfdE': isCookie['.AspNetCore.Antiforgery.vmpBg8YRfdE']
          }
          isCookie = Object.entries(isCookie).map(([name, value]) => cookie.serialize(name, value)).join(' ')
          let $ = cheerio.load(isHtml)
          let token = $('input[name=__RequestVerificationToken]').attr('value')
          let form = new FormData
          form.append('__RequestVerificationToken', token)
          form.append('q', url)
          let json = await (await fetch('https://fbdownloader.app/api/ajaxSearch', {
             method: 'POST',
             headers: {
                Accept: '*/*',
                'Accept-Language': 'en-US,enq=0.9',
                'User-Agent': 'GoogleBot',
                Cookie: isCookie,
                ...form.getHeaders()
             },
             body: form
          })).json()
          let ch = cheerio.load(json.data)
          let data = []
          ch('table > tbody > tr').each(function(i, e) {
             let isUrl = ch(ch(e).find('td')[2]).find('a').attr('href')
             if (typeof isUrl != 'undefined') data.push({
                quality: ch(ch(e).find('td')[0]).text(),
                url: isUrl
             })
          })
          if (data.length == 0) return resolve({
             creator: author,
             status: false
          })
          return resolve({
             creator: author,
             status: true,
             data
          })
       } catch (e) {
          console.log(e)
          resolve({
             creator: author,
             status: false
          })
       }
    })
 }

exports.lovetik = async(url) => {
    return new Promise(async (resolve, reject) => {
       try {
          let header = {
             headers: {
                "Accept": "/",
                "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                "Referer": "https://lovetik.com/",
                "Referrer-Policy": "strict-origin-when-cross-origin"
             }
          }
          let form = new URLSearchParams
          form.append('query', url)
          let json = await (await axios.post('https://lovetik.com/api/ajax/search', form, header)).data
          if (json.mess) return resolve({
             creator: author,
             status: false
          })
          let urls = json.links.map(v => v.a)
          resolve({
             creator: author,
             status: true,
             author: json.author.replace(/<[^>]*>?/gm, ''),
             caption: json.desc,
             data: {
                video: urls[0],
                videoWM: urls[1],
                audio: urls[2] || false
             }
          })
       } catch (e) {
          console.log(e)
          resolve({
             creator: author,
             status: false
          })
       }
    })
 }

exports.kbbi = async (query) => new Promise((resolve, reject) => {
    const url = 'https://kbbi.web.id/'

    axios.get(url + query).then(res => {
        const $ = cheerio.load(res.data)
        const arti = $('div#d1').text().trim()
        resolve(arti)
    }).catch(reject)
})


//varuable
const ytIdRegex = /(?:http(?:s|):\/\/|)(?:(?:www\.|)youtube(?:\-nocookie|)\.com\/(?:watch\?.*(?:|\&)v=|embed\/|v\/)|youtu\.be\/)([-_0-9A-Za-z]{11})/

//fucntion
function post(url, formdata) {
    console.log(Object.keys(formdata).map(key => `${key}=${encodeURIComponent(formdata[key])}`).join('&'))
    return fetch(url, {
        method: 'POST',
        headers: {
            accept: "*/*",
            'accept-language': "en-US,en;q=0.9",
            'content-type': "application/x-www-form-urlencoded; charset=UTF-8"
        },
        body: Object.keys(formdata).map(key => `${key}=${encodeURIComponent(formdata[key])}`).join('&')
    })
}

exports.yta = (url) => {
    return new Promise((resolve, reject) => {
        if (ytIdRegex.test(url)) {
            let ytId = ytIdRegex.exec(url)
            url = 'https://youtu.be/' + ytId[1]
            post('https://www.y2mate.com/mates/en60/analyze/ajax', {
                url,
                q_auto: 0,
                ajax: 1
            })
                .then(res => res.json())
                .then(res => {
                    let document = (new JSDOM(res.result)).window.document
                    let type = document.querySelectorAll('td')
                    let filesize = type[type.length - 10].innerHTML
                    let id = /var k__id = "(.*?)"/.exec(document.body.innerHTML) || ['', '']
                    let thumb = document.querySelector('img').src
                    let title = document.querySelector('b').innerHTML

                    post('https://www.y2mate.com/mates/en60/convert', {
                        type: 'youtube',
                        _id: id[1],
                        v_id: ytId[1],
                        ajax: '1',
                        token: '',
                        ftype: 'mp3',
                        fquality: 128
                    })
                        .then(res => res.json())
                        .then(res => {
                            let KB = parseFloat(filesize) * (1000 * /MB$/.test(filesize))
                            resolve({
                                author: author,
                                dl_link: /<a.+?href="(.+?)"/.exec(res.result)[1],
                                thumb,
                                title,
                                filesizeF: filesize,
                                filesize: KB
                            })
                        }).catch(reject)
                }).catch(reject)
        } else reject('URL INVALID')
    })
}

exports.ytv = (url) => {
    return new Promise((resolve, reject) => {
        if (ytIdRegex.test(url)) {
            let ytId = ytIdRegex.exec(url)
            url = 'https://youtu.be/' + ytId[1]
            post('https://www.y2mate.com/mates/en60/analyze/ajax', {
                url,
                q_auto: 0,
                ajax: 1
            })
                .then(res => res.json())
                .then(res => {
                    console.log('Scraping...')
                    document = (new JSDOM(res.result)).window.document
                    yaha = document.querySelectorAll('td')
                    filesize = yaha[yaha.length - 23].innerHTML
                    id = /var k__id = "(.*?)"/.exec(document.body.innerHTML) || ['', '']
                    thumb = document.querySelector('img').src
                    title = document.querySelector('b').innerHTML

                    post('https://www.y2mate.com/mates/en60/convert', {
                        type: 'youtube',
                        _id: id[1],
                        v_id: ytId[1],
                        ajax: '1',
                        token: '',
                        ftype: 'mp4',
                        fquality: 360
                    })
                        .then(res => res.json())
                        .then(res => {
                            let KB = parseFloat(filesize) * (1000 * /MB$/.test(filesize))
                            resolve({
                                author: author,
                                dl_link: /<a.+?href="(.+?)"/.exec(res.result)[1],
                                thumb,
                                title,
                                filesizeF: filesize,
                                filesize: KB
                            })
                        }).catch(reject)
                }).catch(reject)
        } else reject('URL INVALID')
    })
}

const ytdown = (link) => {
    return new Promise((resolve, reject) => {
        const ytIdRegex = /(?:http(?:s|):\/\/|)(?:(?:www\.|)youtube(?:\-nocookie|)\.com\/(?:watch\?.*(?:|\&)v=|embed\/|v\/|shorts\/)|youtu\.be\/)([-_0-9A-Za-z]{11})/
        if (ytIdRegex.test(link)) {
        let url =  ytIdRegex.exec(link)
        let config = {
            'url': 'https://www.youtube.be/' + url,
            'q_auto': 0,
            'ajax': 1
        }
        let headerss =  {
            "sec-ch-ua": '" Not;A Brand";v="99", "Google Chrome";v="91", "Chromium";v="91"',
            "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
            "Cookie": 'PHPSESSID=6jo2ggb63g5mjvgj45f612ogt7; _ga=GA1.2.405896420.1625200423; _gid=GA1.2.2135261581.1625200423; _PN_SBSCRBR_FALLBACK_DENIED=1625200785624; MarketGidStorage={"0":{},"C702514":{"page":5,"time":1625200846733}}'
        }
    axios('https://www.y2mate.com/mates/en68/analyze/ajax',{
            method: 'POST',
            data: new URLSearchParams(Object.entries(config)),
            headers: headerss
        })
    .then(({ data }) => {
        const $ = cheerio.load(data.result)
        let img = $('div.thumbnail.cover > a > img').attr('src');
        let title = $('div.thumbnail.cover > div > b').text();
        let size = $('#mp4 > table > tbody > tr:nth-child(4) > td:nth-child(2)').text()
        let size_mp3 = $('#audio > table > tbody > tr:nth-child(1) > td:nth-child(2)').text()
        let id = /var k__id = "(.*?)"/.exec(data.result)[1]
        let configs = {
    type: 'youtube',
    _id: id,
    v_id: url[1],
    ajax: '1',
    token: '',
    ftype: 'mp4',
    fquality: 360
  }
    axios('https://www.y2mate.com/mates/en68/convert',{
        method: 'POST',
        data: new URLSearchParams(Object.entries(configs)),
        headers: headerss 
    })
    .then(({data}) => {
        const $ = cheerio.load(data.result)
        let link = $('div > a').attr('href')
    let configss = {
    type: 'youtube',
    _id: id,
    v_id: url[1],
    ajax: '1',
    token: '',
    ftype: 'mp3',
    fquality: 128
  }
    axios('https://www.y2mate.com/mates/en68/convert',{
        method: 'POST',
        data: new URLSearchParams(Object.entries(configss)),
        headers: headerss 
    })
    .then(({ data }) => {
        const $ = cheerio.load(data.result)
        let audio = $('div > a').attr('href')
        const result = {
            status: 200,
            creator: author,
            id: url[1],
            title: title,
            size: size,
            quality: '360p',
            thumb: img,
            link: link,
            size_mp3: size_mp3,
            mp3: audio
        }
        resolve(result)

        })
            })
        })
    .catch(reject)
    }else reject('link invalid')
    })
}
async function TiktokDl(url) {
  return new Promise(async (resolve, reject) => {
    axios.get('https://ttdownloader.com/', {
      headers: {
        "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        "cookie": "PHPSESSID=9ut8phujrprrmll6oc3bist01t; popCookie=1; _ga=GA1.2.1068750365.1625213061; _gid=GA1.2.842420949.1625213061"
      }
    })
    .then(({ data }) => {
      const $ = cheerio.load(data)
      let token = $('#token').attr('value')
      let config = {
        'url': url,
        'format': '',
        'token': token
      }
      axios('https://ttdownloader.com/req/', {
        method: 'POST',
        data: new URLSearchParams(Object.entries(config)),
        headers: {
          "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
          "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
          "cookie": "PHPSESSID=9ut8phujrprrmll6oc3bist01t; popCookie=1; _ga=GA1.2.1068750365.1625213061; _gid=GA1.2.842420949.1625213061"
        }
      })
      .then(({ data }) => {
        const $ = cheerio.load(data)
        resolve({
          code: 200,
          message: 'success',
          creator: author,
          no_wm: $('div:nth-child(2) > div.download > a').attr('href'),
          wm: $('div:nth-child(3) > div.download > a').attr('href'),
          audio: $('div:nth-child(4) > div.download > a').attr('href')
        })
      })
    })
    .catch(reject)
  })
}

async function igDownloader(Link) {
    const hasil = []
    const Form = {
        url: Link,
        submit: ""
    }
    await axios(`https://downloadgram.org/`, {
        method: "POST",
        data:  new URLSearchParams(Object.entries(Form)),
        headers: {
            "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
            "accept-language": "en-US,en;q=0.9,id;q=0.8",
            "cache-control": "max-age=0",
            "content-type": "application/x-www-form-urlencoded",
            "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"90\", \"Google Chrome\";v=\"90\"",
            "cookie": "_ga=GA1.2.1695343126.1621491858; _gid=GA1.2.28178724.1621491859; __gads=ID=8f9d3ef930e9a07b-2258e672bec80081:T=1621491859:RT=1621491859:S=ALNI_MbqLxhztDiYZttJFX2SkvYei6uGOw; __atuvc=3%7C20; __atuvs=60a6eb107a17dd75000; __atssc=google%3B2; _gat_gtag_UA_142480840_1=1"
        },
        referrerPolicy: "strict-origin-when-cross-origin",
    }).then(async res => {
        const $ = cheerio.load(res.data)
        let url = $('#downloadBox').find('a').attr('href');
        await axios(Link, {
            method: "GET",
            data: null,
            headers: {
                "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
                "accept-language": "en-US,en;q=0.9,id;q=0.8",
                "cache-control": "max-age=0",
                "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"90\", \"Google Chrome\";v=\"90\"",
                "cookie": "ig_did=08A3C465-7D43-4D8A-806A-88F98384E63B; ig_nrcb=1; mid=X_ipMwALAAFgQ7AftbrkhIDIdXJ8; fbm_124024574287414=base_domain=.instagram.com; shbid=17905; ds_user_id=14221286336; csrftoken=fXHAj5U3mcJihQEyVXfyCzcg46lHx7QD; sessionid=14221286336%3A5n4czHpQ0GRzlq%3A28; shbts=1621491639.7673564; rur=FTW"
            },
            referrerPolicy: "strict-origin-when-cross-origin"
        }).then(respon => {
            const ch = cheerio.load(respon.data)
            let title = ch('title').text().trim()
            const result = {
                author: author,
                result: {
                    link: url,
                    desc: title,
                    Link: Link
                }
            }
            hasil.push(result)
        })
    })
    return hasil[0]
}

const igstory = (username) => {
    return new Promise(async(resolve, reject) => {
        axios.request({
            url: 'https://www.instagramsave.com/instagram-story-downloader.php',
            method: 'GET',
            headers:{
                "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
                "cookie": "PHPSESSID=ugpgvu6fgc4592jh7ht9d18v49; _ga=GA1.2.1126798330.1625045680; _gid=GA1.2.1475525047.1625045680; __gads=ID=92b58ed9ed58d147-221917af11ca0021:T=1625045679:RT=1625045679:S=ALNI_MYnQToDW3kOUClBGEzULNjeyAqOtg"
            }
        })
        .then(({ data }) => {
            const $ = cheerio.load(data)
            const token = $('#token').attr('value')
            let config ={
                headers: {
                    'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    "sec-ch-ua": '" Not;A Brand";v="99", "Google Chrome";v="91", "Chromium";v="91"',
                    "cookie": "PHPSESSID=ugpgvu6fgc4592jh7ht9d18v49; _ga=GA1.2.1126798330.1625045680; _gid=GA1.2.1475525047.1625045680; __gads=ID=92b58ed9ed58d147-221917af11ca0021:T=1625045679:RT=1625045679:S=ALNI_MYnQToDW3kOUClBGEzULNjeyAqOtg",
                    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
                },
                data: new URLSearchParams({
                    'url':'https://www.instagram.com/'+ username,
                    'action': 'story',
                    'token': token
                })
            }
        axios.post('https://www.instagramsave.com/system/action.php',qs.stringify(config.data), { headers: config.headers })
        .then(({ data }) => {
        resolve(data)
           })
        })
    .catch(reject)
    })
}

async function webp2mp4(source) {
  let form = new FormData
  let isUrl = typeof source === 'string' && /https?:\/\//.test(source)
  form.append('new-image-url', isUrl ? source : '')
  form.append('new-image', isUrl ? '' : source, 'image.webp')
  let res = await fetch('https://ezgif.com/webp-to-mp4', {
    method: 'POST',
    body: form
  })
  let html = await res.text()
  let { document } = new JSDOM(html).window
  let form2 = new FormData
  let obj = {}
  for (let input of document.querySelectorAll('form input[name]')) {
    obj[input.name] = input.value
    form2.append(input.name, input.value)
  }
  let res2 = await fetch('https://ezgif.com/webp-to-mp4/' + obj.file, {
    method: 'POST',
    body: form2
  })
  let html2 = await res2.text()
  let { document: document2 } = new JSDOM(html2).window
  return new URL(document2.querySelector('div#output > p.outfile > video > source').src, res2.url).toString()
}

async function webp2png(source) {
  let form = new FormData
  let isUrl = typeof source === 'string' && /https?:\/\//.test(source)
  form.append('new-image-url', isUrl ? source : '')
  form.append('new-image', isUrl ? '' : source, 'image.webp')
  let res = await fetch('https://ezgif.com/webp-to-png', {
    method: 'POST',
    body: form
  })
  let html = await res.text()
  let { document } = new JSDOM(html).window
  let form2 = new FormData
  let obj = {}
  for (let input of document.querySelectorAll('form input[name]')) {
    obj[input.name] = input.value
    form2.append(input.name, input.value)
  }
  let res2 = await fetch('https://ezgif.com/webp-to-png/' + obj.file, {
    method: 'POST',
    body: form2
  })
  let html2 = await res2.text()
  let { document: document2 } = new JSDOM(html2).window
  return new URL(document2.querySelector('div#output > p.outfile > img').src, res2.url).toString()
}



module.exports.webp2mp4 = webp2mp4
module.exports.webp2png = webp2png
module.exports.igstory = igstory
module.exports.ytdown = ytdown
module.exports.igDownloader = igDownloader
module.exports.TiktokDl = TiktokDl
module.exports.Shoope = Shoope
module.exports.Gempa = Gempa
module.exports.GSMArena = GSMArena
module.exports.Emoji = Emoji
module.exports.Wikipedia = Wikipedia
module.exports.RandomCerpen = RandomCerpen
module.exports.Covid = covid
module.exports.Downloader = downloader
module.exports.Anime = anime
module.exports.Manga = manga
module.exports.Character = character
module.exports.JadwalBola = jadwalbola
module.exports.JadwalTv = jadwaltv
module.exports.JadwalSholat = jadwalsholat
module.exports.Pinterest = pinterest
module.exports.Film = film
module.exports.Wattpad = wattpad
module.exports.WattpadUser = wattpaduser
module.exports.Webtoons = webtoons
module.exports.Mangatoons = mangatoons
module.exports.Drakor = drakor
module.exports.StickerSearch = stickersearch
module.exports.ListSurah = listsurah
module.exports.Surah = surah
module.exports.TafsirSurah = tafsirsurah
module.exports.KompasNews = kompasnews