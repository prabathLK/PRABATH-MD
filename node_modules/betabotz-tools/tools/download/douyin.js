/*
Tools Douyin Downloader
*/

const axios = require('axios');
const { baseUrl } = require('../config.js')

async function douyin(url) {
  try {
    const { data } = await axios.get(`${baseUrl}/tools/douyindl?url=${url}`, {
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

module.exports = { douyin }