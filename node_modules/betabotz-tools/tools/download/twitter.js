/*
Tools Twitter Downloader
*/

const axios = require('axios');
const { baseUrl } = require('../config.js')

async function twitter(url) {
  try {
    const { data } = await axios.get(`${baseUrl}/tools/twitterdl?url=${url}`, {
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

module.exports = { twitter }