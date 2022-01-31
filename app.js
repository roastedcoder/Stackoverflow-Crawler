


const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs');
const express = require('express');
const http = require("http");

const app = express();
const BASE_URL = 'https://stackoverflow.com/';


request('https://stackoverflow.com/questions', function (err, res, body) {
    if(err) console.log(err, "error occured while hitting URL");
    else {
        const $ = cheerio.load(body);

        $('.question-summary').each(function(i, e) {
            const href = $(e).find('.question-hyperlink').attr('href');
            const views = parseInt($(e).find('.views').html());
            const upvotes = $(e).find('.vote-count-post').find('strong').html();
            const answers = $(e).find('.status').find('strong').html();

            const questionURL = BASE_URL + href;

            

            console.log(questionURL);
        });
    }
});
