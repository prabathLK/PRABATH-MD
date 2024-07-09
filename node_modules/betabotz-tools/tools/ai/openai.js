/*
Tools Openai
*/

const axios = require('axios');
const { baseUrl } = require('../config.js')

async function openai(text) {
  try {
    const { data } = await axios.get(`${baseUrl}/tools/openai?q=${text}`, {
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

module.exports = { openai }