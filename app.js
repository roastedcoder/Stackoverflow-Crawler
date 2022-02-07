


const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs');
const express = require('express');
const http = require('http');
const cluster = require('cluster');
const cpus = require('os').cpus();


const app = express();

// creating a writestream using filesystem library
const writeStream = fs.createWriteStream('data.csv');
writeStream.write(`QuestionURL, Views, Upvotes, Answers, pID \n`);


const BASE_URL = 'https://stackoverflow.com/';
const pages = 500; // not 10000 coz they blocked my IP for some time

if(cluster.isMaster) {
    console.log(`Master ${process.pid} is running...`);
    for(let i = 0; i<5; i++) { // scaling upto 5 concurrent users
        cluster.fork();
    }
}
else { // using worker processes to achieve concurrency
    const message = `Process ${process.pid} started...`
    console.log(message);
    scrapData(process.pid); // scraping and saving the data into .csv
}
async function scrapData(pID) { // scraping the data using cheerio asynchronously
    for(let i = 1; i<=pages; i++) {
        await request(`https://stackoverflow.com/questions?tab=newest&page=${i}`, function (err, res, body) {
            if(err) console.log(err, "error occured while hitting URL");
            else {
                const $ = cheerio.load(body); // getting the DOM of the required web-page

                
                $('.question-summary').each(function(i, e) {
                    const href = $(e).find('.question-hyperlink').attr('href');
                    const views = parseInt($(e).find('.views').html());
                    const upvotes = $(e).find('.vote-count-post').find('strong').html();
                    const answers = $(e).find('.status').find('strong').html();
    
                    const questionURL = BASE_URL + href;
                    
                    writeStream.write(`${questionURL}, ${views}, ${upvotes}, ${answers}, ${pID} \n`);
                });
                
                console.log('Crawling Done...');
            }
        });
    }
}