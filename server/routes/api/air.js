const express = require('express');
const router = express.Router();

const Client = require('node-rest-client').Client;
const client = new Client();

router.get('/', (req, res) => {
  const url = "https://data.boch.gov.tw/data/opendata/v2/assetsCase/1.1.json";
  const options = {
    host: url,
    method: 'GET'
  };
  client.get(url, (data, response) => { 
    res.json({...data});
  });
});

module.exports = router;
