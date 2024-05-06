var express = require('express');
var router = express.Router();
const puppeteer = require('puppeteer');
const axios = require('axios');
const https = require('https');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});



module.exports = router;
