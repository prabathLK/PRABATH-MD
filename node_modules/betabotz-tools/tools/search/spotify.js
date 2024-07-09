/*
Tools Spotify Search
*/

const axios = require('axios');
const { baseUrl } = require('../config.js')

async function spotify(input) {
  try {
    const { data } = await axios.get(`${baseUrl}/tools/spotify-search?q=${input}`, {
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

module.exports = { spotify }