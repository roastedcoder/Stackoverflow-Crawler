


const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs');
const express = require('express');
const http = require('http');
const cluster = require('cluster');
const { find } = require('domutils');
const cpus = require('os').cpus();
const webdriver = require('selenium-webdriver');
const puppeteer = require('puppeteer');


const app = express();

const writeStream = fs.createWriteStream('data.csv');
writeStream.write(`name, body \n`);


const BASE_URL = 'https://bitbucket.org/easyecom/easyecom/wiki/EasyEcomApi';


async function start() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(BASE_URL);

    await page.click('.fHxlH');


    let name = await page.evaluate(() =>  {
        return Array.from(document.querySelectorAll('#app > div > main > div._1hG2l > div > div:nth-child(2) > div > div > div > div > div._1YJoz > div._2J3UR')).map(x => x.textContent)
    });

    let body = await page.evaluate(() =>  {
        return Array.from(document.querySelectorAll('#app > div > main > div._1hG2l > div > div:nth-child(2) > div > div > div > div > div._2SwvP > div')).map(x => x.textContent.replace(/\n/g,' ').replace(/\s+/g,' '))
    });

    for(let i = 0; i<name.length; i++) {
        writeStream.write(`${name[i]},"${body[i]}" \n`);
    }

    await browser.close;
    console.log('end');
}

start();