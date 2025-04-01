const axios = require('axios');
require('dotenv').config();

const urls = process.env.URLS.split(',');
const interval = parseInt(process.env.INTERVAL, 10) || 1000;

function getRandomUrl() {
    const randomIndex = Math.floor(Math.random() * urls.length);
    return urls[randomIndex];
}

function makeRequest() {
    const url = getRandomUrl();
    console.log(`Making request to: ${url}`);
    axios.get(url)
        .then(response => {
            console.log(`Response from ${url}:`, response.data);
        })
        .catch(error => {
            console.error(`Error fetching ${url}:`, error.message);
        });
}

setInterval(makeRequest, interval);
