
const axios = require('axios');
const Jimp = require('jimp');
const FormData = require('form-data');
const { baseUrl } = require('../config.js')

/**Scraper Form 
https://tools.betabotz.org
**/


async function remini(input) {
  const image = await Jimp.read(input);
  const buffer = await new Promise((resolve, reject) => {
    image.getBuffer(Jimp.MIME_JPEG, (err, buf) => {
      if (err) {
        reject('Terjadi Error Saat Mengambil Data......');
      } else {
        resolve(buf);
      }
    });
  });
  const form = new FormData();
  form.append('image', buffer, { filename: 'remini.jpg' });
  try {
    const { data } = await axios.post(`${baseUrl}/ai/remini`, form, {
      headers: {
        ...form.getHeaders(),
        'accept': 'application/json',
      },
    });
    var res = {
      image_data: data.result,
      image_size: data.size
    };
    return res;
  } catch (error) {
    console.error('Identifikasi Gagal:', error);
    return 'Identifikasi Gagal';
  }
}

module.exports = { remini }