/*
Tools All In One Video Downloader
*/

const axios = require('axios');
const { baseUrl } = require('../config.js')

async function aio(url) {
  try {
    const { data } = await axios.get(`${baseUrl}/tools/aio?url=${url}`, {
      headers: {
        'accept': 'application/json',
      },
    });
    return data;
  } catch (error) {
    console.error(error);
    return 'Internal Server Error!';
  }
}

module.exports = { aio }