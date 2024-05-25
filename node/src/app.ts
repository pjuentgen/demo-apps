/* eslint-disable no-console */

import express, { Express } from 'express';

const app: Express = express();

const TIME: number = parseInt(process.env.TIME || '500');
const TIME_FOR_ERROR: number = parseInt(process.env.TIME_FOR_ERROR || '500');
const READIENESS_DELAY: number = parseInt(process.env.TIME_FOR_ERROR || '0');
const REMOTE_URL: string =
  process.env.REMOTE_URL || 'https://api.chucknorris.io/jokes/random';

app.get('/', (req, res) => {
  console.log('Request to /');
  const randomTime = Math.floor(Math.random() * TIME);

  setTimeout(() => {
    if (randomTime > 300) {
      res.status(500).send('Error occured');
    } else {
      res.send('Hello World!');
    }
  }, randomTime);
});

app.get('/random-error', (req, res) => {
  console.log('Request to /random-error');
  const randomTime = Math.floor(Math.random() * TIME);

  setTimeout(() => {
    if (randomTime > TIME_FOR_ERROR) {
      res.status(500).send('Error occured');
    } else {
      res.send('Hello World!');
    }
  }, randomTime);
});

app.get('/bad', (req, res) => {
  console.log('Request to /bad');
  res.status(500).send('Error occured');
});

app.get('/healthy', (req, res) => {
  console.log('Request to /healthy');
  res.send('Hello World!');
});

app.get('/remote', async (req, res) => {
  console.log('Request to /remote');
  console.log('Connecting to ' + REMOTE_URL);
  try {
    const data = await fetch(REMOTE_URL);
    const body = await data.json();
    res.send(body);
  } catch (error) {
    console.error('Error occurred while fetching remote data:', error);
    res.status(500).send('Error occurred while fetching remote data');
  }
});

app.get('/liveness', (req, res) => {
  console.log('Request to /liveness');
  res.send('Live');
});

app.get('/readiness', (req, res) => {
  console.log('Request to /readiness');
  setTimeout(() => {
    res.send('Ready');
  }, READIENESS_DELAY);
});

export default app;
