/*
Tools Instagram Stalk/Instagram Finder By Username 
*/

const axios = require('axios');
const { baseUrl } = require('../config.js')

async function stalkig(username) {
  try {
    const { data } = await axios.get(`${baseUrl}/tools/stalk-ig?q=${username}`, {
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

module.exports = { stalkig }