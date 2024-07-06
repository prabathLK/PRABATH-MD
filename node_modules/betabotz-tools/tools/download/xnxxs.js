/*
Tools Xnxx Search
*/

const axios = require('axios');
const { baseUrl } = require('../config.js')

async function xnxxs(q) {
  try {
    const { data } = await axios.get(`${baseUrl}/tools/xnxxsearch?q=${q}`, {
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

module.exports = { xnxxs }
