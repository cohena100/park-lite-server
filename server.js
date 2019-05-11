const express = require('express');
const app = express();
const CryptoJS = require('crypto-js');
const axios = require('axios');
const {
  parseString,
} = require('xml2js');
const moment = require('moment');
const {
  promisify,
} = require('util');

app.get('', (req, res) => {
  res.send('Hello express!');
});

app.get('/login', async (req, res) => {
  const xml = await foo(req.query.phone, req.query.car);
  const result = xml.ipango.ok;
  res.send(result);
});

app.get('/handshake', async (req, res) => {
  const token = req.query.token;
  res.send(token);
});

app.listen(3000, () => {
  console.log('Server is up on port 3000.');
});

async function foo(phone, car) {
  const key = 'qTZDOw9ZxDrKs/O+KQ4EzbPmifLMN9gl9bTTFUQ' +
    'AvHqyeGpCCm7YElFgHd+A53FvA6KSM57VgNCcVXPS9agPCw==';
  const userName = 'iPhAndPr5';
  const api = 'p2a6n1g2o0';
  const val = phone + '&' +
    car + '&' +
    '1518BCEC-D521-40C2-8CB4-A780CDA382EF' + '&' +
    key;
  const hash = CryptoJS.HmacSHA256(val, key).toString(CryptoJS.enc.Base64);
  const password = `${userName}${moment().format('MMYYYY')}${api}`;
  const udid = '1518BCEC-D521-40C2-8CB4-A780CDA382EF';
  const internalId = '0';
  const token = ';v7.8.1;Simulator;12.1';
  const tokenType = '1';
  const langId = '1';
  const isChangeLang = 'false';
  try {
    const params = `strPhoneNumber=${phone}` + '&' +
      `strCarNumber=${car}` + '&' +
      `strUDIDNumber=${udid}` + '&' +
      `signature=${hash}` + '&' +
      `UserName=${userName}` + '&' +
      `Password=${password}` + '&' +
      `p_int_internalID=${internalId}` + '&' +
      `P_token=${token}` + '&' +
      `token_type=${tokenType}` + '&' +
      `LangId=${langId}` + '&' +
      `IsChangeLang=${isChangeLang}`;
    const response = await axios.post(
      'https://www.mcpsmartphonews.4500.co.il/UnicellAPI/Unicell/' +
      'iphoneacountdetails',
      params
    );
    let xml = response.data;
    const parsed = await promisify(parseString)(xml, {
      trim: true,
    });
    return parsed;
  } catch (e) {
    console.error(e);
  }
}