/*
Tools Xvideos Search
*/

const axios = require('axios');
const { baseUrl } = require('../config.js')

async function xvideoss(q) {
  try {
    const { data } = await axios.get(`${baseUrl}/tools/xvideosearch?q=${q}`, {
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

module.exports = { xvideoss }
