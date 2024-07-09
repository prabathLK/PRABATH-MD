const esana = require('./esana')
const fs = require('fs')

class Esana {
    constructor(last_id = '',file_name='id_save_file') {
        this.last_id = last_id
        this.file_name = file_name + '.txt'
        this.running_loop = false
    }
    async news(news_id) {
        return await esana.esana_news(news_id)
    }
    async comments(news_id) {
        return await esana.esana_news_comments(news_id)
    }
    async list() {
        return await esana.esana_news_list()
    }
    async latest_news() {
            return await esana.esana_latest_news()
    }
    async latest_id() {
            return await esana.esana_latest_news_id()
    }
    save_id(news_id) {
            this.last_id = news_id
            fs.writeFileSync(this.file_name,news_id)
    }
    read() {
        try {
           return fs.readFileSync(this.file_name,'utf-8')
        } catch {}
        return ''
    }
    get_id() {
        this.last_id = this.last_id || this.read()
        return this.last_id
    }
    news_loop(callback,ms = 60*1000) {
        this.clear_loop()
        this.running_loop = setInterval(async () => {
            var news = await this.latest_id()
            var old = this.get_id()
            if(news.results.news_id != old) {
                this.save_id('' + news.results.news_id)
                var full_news = await this.news(news.results.news_id)
                await callback(full_news)
            }
        },ms)
    }
    clear_loop() {
        try{
            clearInterval(this.running_loop)
        } catch {}
    }
   
}

module.exports = Esana